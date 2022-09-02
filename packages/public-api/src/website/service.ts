import {
  WebPageScan,
  getDatabaseConnection,
  internalApi,
  Hostname,
  WebPage,
} from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';
import { ApiScanReport } from '../internalApiRouter';
import { syncPackageUsageByHost } from '../projections/syncPackageUsageByHost';
import { syncScansWithVulnerabilities } from '../projections/syncScansWithVulnerabilities';

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

  return await db.transaction(async (em) => {
    const webPageScanRepo = em.getRepository(WebPageScan);

    const webPageEntity = await findOrCreateWebPage(parsedUrl, em);

    const mostRecentScan = await webPageScanRepo
      .createQueryBuilder('webpagescan')
      .where('webpagescan.web_page_id = :webPageId', { webPageId: webPageEntity.id })
      .orderBy('webpagescan.createdAt', 'DESC')
      .limit(1)
      .getOne();

    if (mostRecentScan && Date.now() - mostRecentScan.createdAt.getTime() < RESCAN_TIMEOUT_MS) {
      return mostRecentScan;
    }

    const webPageScanEntity = await webPageScanRepo.save({
      webPage: webPageEntity,
      status: WebPageScan.Status.Pending,
    });

    await internalApi.requestWebPageScan(parsedUrl.toString(), webPageEntity.id.toString());

    return webPageScanEntity;
  });
}

export async function syncWebPageScanResult(scanReport: ApiScanReport) {
  const db = await getDatabaseConnection();

  await db.transaction(async (em) => {
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
      syncPackageUsageByHost(scanEntity, em),
      syncScansWithVulnerabilities(scanEntity, em),
    ]);
  });
}

function mapInternalWebsiteStatus(status: internalApi.WebPageScanStatus) {
  switch (status) {
    case internalApi.WebPageScanStatus.Invalid:
      return WebPageScan.Status.Unsupported;
    case internalApi.WebPageScanStatus.InProgress:
      return WebPageScan.Status.Pending;
    case internalApi.WebPageScanStatus.Protected:
      return WebPageScan.Status.Protected;
    default:
      return WebPageScan.Status.Processed;
  }
}
