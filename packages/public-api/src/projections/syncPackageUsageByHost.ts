import { PackageUsageByHostnameProjection, WebPage, WebPageScan } from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';

export async function syncPackageUsageByHost(newScan: WebPageScan, em: EntityManager) {
  if (!newScan.scanResult) {
    throw new Error('Scan was not completed');
  }

  const packageUsageByHostRepo = em.getRepository(PackageUsageByHostnameProjection);
  const webPageScanRepo = em.getRepository(WebPageScan);
  const webPageRepo = em.getRepository(WebPage);

  const previousScan = await webPageScanRepo
    .createQueryBuilder('webpagescan')
    .where('webpagescan.id < :newId', { newId: newScan.id })
    .orderBy('webpagescan.id DESC')
    .limit(1)
    .getOne();

  if (previousScan) {
    await packageUsageByHostRepo
      .createQueryBuilder('packageusage')
      .delete()
      .where('packageusage.source_scan_id = :scanId', { scanId: previousScan.id })
      .execute();
  }

  const relatedWebPage = await webPageRepo
    .createQueryBuilder('webpage')
    .where('webpage.id = :id', { id: newScan.webPageId })
    .leftJoinAndSelect('webpage.hostname', 'hostname')
    .getOneOrFail();

  const packageUsageEntities = newScan.scanResult.packages.map((sourcePackage) =>
    packageUsageByHostRepo.create({
      hostname: relatedWebPage.hostname,
      sourceScan: newScan,
      packageName: sourcePackage.name,
      packageVersionSet: sourcePackage.versionSet,
    })
  );

  if (packageUsageEntities) {
    await packageUsageByHostRepo.save(packageUsageEntities);
  }
}
