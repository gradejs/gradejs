import {
  WebPageScan,
  getDatabaseConnection,
  internalApi,
  Hostname,
  WebPage,
} from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';
import { syncPackageUsageByHostname } from '../projections/syncPackageUsageByHostname';
import { syncScansWithVulnerabilities } from '../projections/syncScansWithVulnerabilities';
import { SystemApi } from '../systemApiRouter';

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

export async function requestWebPageScan(url: string) {
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

    if (mostRecentScan && Date.now() - mostRecentScan.createdAt.getTime() < RESCAN_TIMEOUT_MS) {
      return mostRecentScan;
    }

    const webPageScanEntity = await webPageScanRepo.save({
      webPage: webPageEntity,
      status: WebPageScan.Status.Pending,
    });

    await internalApi.requestWebPageScan(parsedUrl.toString(), webPageScanEntity.id.toString());

    return webPageScanEntity;
  });

  return result;
}

export async function syncWebPageScanResult(scanReport: SystemApi.ScanReport) {
  const db = await getDatabaseConnection();

  return await db.transaction(async (em) => {
    const webPageScanRepo = em.getRepository(WebPageScan);

    let scanEntity: WebPageScan;
    if (scanReport.id) {
      scanEntity = await webPageScanRepo.findOneOrFail({ id: parseInt(scanReport.id, 10) });
    } else {
      const webPageEntity = await findOrCreateWebPage(new URL(scanReport.url), em);
      scanEntity = webPageScanRepo.create({
        webPage: webPageEntity,
      });
    }

    scanEntity.status = mapInternalWebsiteStatus(scanReport.status);
    scanEntity.finishedAt = new Date();
    scanEntity.scanResult = scanReport.scan;

    await webPageScanRepo.save(scanEntity);

    await Promise.all([
      syncPackageUsageByHostname(scanEntity, em),
      syncScansWithVulnerabilities(scanEntity, em),
    ]);

    return scanEntity;
  });
}

function mapInternalWebsiteStatus(status: internalApi.WebPageScan.Status) {
  switch (status) {
    case internalApi.WebPageScan.Status.Invalid:
      return WebPageScan.Status.Unsupported;
    case internalApi.WebPageScan.Status.InProgress:
      return WebPageScan.Status.Pending;
    case internalApi.WebPageScan.Status.Protected:
      return WebPageScan.Status.Protected;
    default:
      return WebPageScan.Status.Processed;
  }
}
