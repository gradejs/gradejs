import { getRepository } from 'typeorm';
import {
  PackageMetadata,
  ScansWithVulnerabilitiesProjection,
  ShowcasedPackage,
  ShowcasedWebPage,
  WebPageScan,
} from '@gradejs-public/shared';

async function getLatestShowcasedScans(limit = 3) {
  const showcasedWebPageRepo = getRepository(ShowcasedWebPage);
  const webPageScanRepo = getRepository(WebPageScan);

  const showcasedWebPages = await showcasedWebPageRepo
    .createQueryBuilder('showcasedWebPage')
    .orderBy('showcasedWebPage.displayOrder', 'ASC')
    .limit(limit)
    .getMany();

  if (!showcasedWebPages.length) {
    return [];
  }

  // While being a heavy query, this is alleviated by web_page_id, created_at index on scan table
  const showcasedScans = await webPageScanRepo
    .createQueryBuilder('scan')
    .distinctOn(['scan.web_page_id'])
    .leftJoinAndSelect('scan.webPage', 'webPage')
    .leftJoinAndSelect('webPage.hostname', 'hostname')
    .where('scan.web_page_id in (:...webPageIds)', {
      webPageIds: showcasedWebPages.map((it) => it.webPageId),
    })
    .andWhere('scan.status = :processedStatus', { processedStatus: WebPageScan.Status.Processed })
    .addOrderBy('scan.web_page_id')
    .addOrderBy('scan.createdAt', 'DESC')
    .getMany();

  const orderMapping = showcasedWebPages.reduce((acc, val) => {
    acc[val.webPageId] = val.displayOrder;
    return acc;
  }, {} as Record<number, number>);

  return showcasedScans.sort((a, b) => orderMapping[a.webPageId] - orderMapping[b.webPageId]);
}

async function getShowcasedScansWithVulnerabilities(limit = 3) {
  const scansWithVulnerabilitiesRepo = getRepository(ScansWithVulnerabilitiesProjection);

  return scansWithVulnerabilitiesRepo
    .createQueryBuilder('scanWithVulnerabilities')
    .leftJoinAndSelect('scanWithVulnerabilities.sourceScan', 'scan')
    .leftJoinAndSelect('scan.webPage', 'webpage')
    .leftJoinAndSelect('webpage.hostname', 'hostname')
    .orderBy('scanWithVulnerabilities.createdAt', 'DESC')
    .limit(limit)
    .getMany();
}

async function getShowcasedPackages(limit = 6) {
  const showcasedPackagesRepo = getRepository(ShowcasedPackage);

  return showcasedPackagesRepo
    .createQueryBuilder('showcasedPackage')
    .leftJoinAndMapOne(
      'showcasedPackage.packageMetadata',
      PackageMetadata,
      'packageMetadata',
      'showcasedPackage.packageName = packageMetadata.name'
    )
    .leftJoin('showcasedPackage.packagePopularity', 'packagePopularity')
    .select(['showcasedPackage.displayOrder', 'showcasedPackage.packageName'])
    .addSelect(['packageMetadata.description'])
    .addSelect(['packagePopularity.usageByHostnameCount'])
    .orderBy('showcasedPackage.displayOrder', 'ASC')
    .limit(limit)
    .getMany();
}

export async function getShowcaseData() {
  const [showcasedScans, scansWithVulnerabilities, showcasedPackages] = await Promise.all([
    getLatestShowcasedScans(),
    getShowcasedScansWithVulnerabilities(),
    getShowcasedPackages(),
  ]);

  return {
    showcasedScans,
    scansWithVulnerabilities,
    showcasedPackages,
  };
}
