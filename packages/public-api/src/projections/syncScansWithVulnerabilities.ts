import { ScansWithVulnerabilitiesProjection, WebPageScan } from '@gradejs-public/shared';
import { EntityManager } from 'typeorm';
import { getAffectingVulnerabilities } from '../vulnerabilities/vulnerabilities';

export async function syncScansWithVulnerabilities(newScan: WebPageScan, em: EntityManager) {
  if (!newScan.scanResult) {
    throw new Error('Scan was not completed');
  }

  const affectingVulnerabilities = await getAffectingVulnerabilities(newScan.scanResult);

  const vulnerabilityList = Object.values(affectingVulnerabilities).flat();
  if (!vulnerabilityList.length) {
    return;
  }

  const scansWithVulnerabilitiesRepo = em.getRepository(ScansWithVulnerabilitiesProjection);

  await scansWithVulnerabilitiesRepo.save({
    sourceScan: newScan,
    vulnerabilities: vulnerabilityList.map((vulnerability) => ({
      packageName: vulnerability.affectedPackageName,
      severity: vulnerability.severity,
    })),
  });
}
