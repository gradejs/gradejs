import { getRepository } from 'typeorm';
import { ScansWithVulnerabilitiesProjection, ShowcasedScan } from '@gradejs-public/shared';

export async function getShowcaseData() {
  const showcasedScansRepo = getRepository(ShowcasedScan);
  const scansWithVulnerabilitiesRepo = getRepository(ScansWithVulnerabilitiesProjection);

  const showcasedScansQuery = await showcasedScansRepo
    .createQueryBuilder('showcasedScan')
    .leftJoinAndSelect('showcasedScan.scan', 'scan')
    .leftJoinAndSelect('scan.webPage', 'webpage')
    .leftJoinAndSelect('webpage.hostname', 'hostname')
    .orderBy('showcasedScan.displayOrder', 'DESC')
    .limit(3)
    .getMany();

  const scansWithVulnerabilitiesQuery = scansWithVulnerabilitiesRepo
    .createQueryBuilder('scanWithVulnerabilities')
    .leftJoinAndSelect('scanWithVulnerabilities.sourceScan', 'scan')
    .leftJoinAndSelect('scan.webPage', 'webpage')
    .leftJoinAndSelect('webpage.hostname', 'hostname')
    .orderBy('scanWithVulnerabilities.createdAt', 'DESC')
    .limit(3)
    .getMany();

  const [showcasedScans, scansWithVulnerabilities] = await Promise.all([
    showcasedScansQuery,
    scansWithVulnerabilitiesQuery,
  ]);

  return {
    showcasedScans,
    scansWithVulnerabilities,
  };
}
