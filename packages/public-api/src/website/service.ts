import {
  WebPageScan,
  getDatabaseConnection,
  systemApi,
  Hostname,
  WebPage,
  logger,
} from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';
import { syncPackageUsageByHostname } from '../projections/syncPackageUsageByHostname';
import { syncScansWithVulnerabilities } from '../projections/syncScansWithVulnerabilities';
import { saveScanWebPageFavicon } from './metadata/favicon';

const RESCAN_TIMEOUT_MS = 1000 * 60 * 60 * 24; // 1 day in ms

export async function findOrCreateWebPage(url: URL, em: EntityManager) {
  const hostnameRepo = em.getRepository(Hostname);
  const webPageRepo = em.getRepository(WebPage);

  let hostnameEntity = await hostnameRepo.findOne({
    hostname: url.hostname,
  });
  if (!hostnameEntity) {
    hostnameEntity = await hostnameRepo.save({
      hostname: url.hostname,
    });
  }

  let webPageEntity = await webPageRepo
    .createQueryBuilder('web_page')
    .where('web_page.hostname_id = :hostnameId', { hostnameId: hostnameEntity.id })
    .andWhere('web_page.path = :path', { path: url.pathname })
    .limit(1)
    .getOne();
  if (!webPageEntity) {
    webPageEntity = await webPageRepo.save({
      hostname: hostnameEntity,
      path: url.pathname,
    });
  }

  return webPageEntity;
}

export function isRescanAvailable(scan: WebPageScan) {
  return Date.now() - scan.createdAt.getTime() > RESCAN_TIMEOUT_MS;
}

export async function getOrRequestWebPageScan(url: string, performScan = false) {
  const parsedUrl = new URL(url);

  const db = await getDatabaseConnection();

  const result = await db.transaction(async (em) => {
    const webPageScanRepo = em.getRepository(WebPageScan);

    const webPageEntity = await findOrCreateWebPage(parsedUrl, em);

    const mostRecentScan = await webPageScanRepo
      .createQueryBuilder('scan')
      .where('scan.web_page_id = :webPageId', { webPageId: webPageEntity.id })
      .orderBy('scan.created_at', 'DESC')
      .limit(1)
      .getOne();

    if (!performScan) {
      return mostRecentScan;
    }

    if (mostRecentScan && !isRescanAvailable(mostRecentScan)) {
      return mostRecentScan;
    }

    const webPageScanEntity = await webPageScanRepo.save({
      webPage: webPageEntity,
      status: WebPageScan.Status.Pending,
    });

    await systemApi.requestWebPageScan(parsedUrl.toString(), webPageScanEntity.id.toString());

    return webPageScanEntity;
  });

  return result;
}

export async function syncWebPageScanResult(scanReport: systemApi.ScanReport) {
  const db = await getDatabaseConnection();

  return await db.transaction(async (em) => {
    const webPageScanRepo = em.getRepository(WebPageScan);

    const scanReportUrl = new URL(scanReport.url);

    let scanEntity: WebPageScan;
    if (scanReport.requestId) {
      scanEntity = await webPageScanRepo.findOneOrFail({ id: parseInt(scanReport.requestId, 10) });
    } else {
      const webPageEntity = await findOrCreateWebPage(scanReportUrl, em);
      scanEntity = webPageScanRepo.create({
        webPage: webPageEntity,
      });
    }

    scanEntity.status = mapScanReportStatus(scanReport.status);
    scanEntity.finishedAt = new Date();

    if (scanReport.status === 'ready') {
      scanEntity.scanResult = {
        identifiedModuleMap: scanReport.identifiedModuleMap,
        identifiedPackages: scanReport.identifiedPackages,
        processedScripts: scanReport.processedScripts,
        identifiedBundler: scanReport.identifiedBundler,
      };
    }

    await webPageScanRepo.save(scanEntity);

    if (scanEntity.status === 'processed' && scanReport.status === 'ready') {
      await Promise.all([
        syncPackageUsageByHostname(scanEntity, em),
        syncScansWithVulnerabilities(scanEntity, em),
        saveScanWebPageFavicon(scanReportUrl, scanReport.sourcePageMetadata).catch((e) =>
          logger.error(e)
        ),
      ]);
    }

    return scanEntity;
  });
}

// TODO: add protected website use-case
function mapScanReportStatus(status: string) {
  switch (status) {
    case systemApi.ScanReport.Status.Ready:
      return WebPageScan.Status.Processed;
    default:
      return WebPageScan.Status.Failed;
  }
}
