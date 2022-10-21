import { PackageUsageByHostnameProjection, WebPage, WebPageScan } from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';

export async function syncPackageUsageByHostname(newScan: WebPageScan, em: EntityManager) {
  if (!newScan.scanResult) {
    throw new Error('Scan was not completed');
  }

  const packageUsageByHostRepo = em.getRepository(PackageUsageByHostnameProjection);
  const webPageScanRepo = em.getRepository(WebPageScan);
  const webPageRepo = em.getRepository(WebPage);

  const previousScan = await webPageScanRepo
    .createQueryBuilder('webpagescan')
    .where('webpagescan.id < :newId', { newId: newScan.id })
    .andWhere('webpagescan.web_page_id = :webPageId', { webPageId: newScan.webPageId })
    .orderBy('webpagescan.id', 'DESC')
    .limit(1)
    .getOne();

  if (previousScan) {
    await em
      .createQueryBuilder()
      .delete()
      .from(PackageUsageByHostnameProjection)
      .where('source_scan_id = :scanId', { scanId: previousScan.id })
      .execute();
  }

  const relatedWebPage = await webPageRepo
    .createQueryBuilder('webpage')
    .where('webpage.id = :id', { id: newScan.webPageId })
    .leftJoinAndSelect('webpage.hostname', 'hostname')
    .getOneOrFail();

  const packageUsageEntities = newScan.scanResult.identifiedPackages.map((sourcePackage) =>
    packageUsageByHostRepo.create({
      hostname: relatedWebPage.hostname,
      sourceScan: newScan,
      packageName: sourcePackage.name,
      packageVersionSet: sourcePackage.versionSet,
    })
  );

  if (packageUsageEntities.length) {
    await packageUsageByHostRepo.save(packageUsageEntities);
  }
}
