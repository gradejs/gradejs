import {
  GithubAdvisoryDatabaseSpecific,
  PackageVulnerabilityData,
  PackageVulnerability,
  ScanResult,
} from '@gradejs-public/shared';
import { getRepository } from 'typeorm';
import semver from 'semver';

export async function getVulnerabilitiesByPackageNames(packageNames: string[]) {
  if (packageNames.length === 0) {
    return [];
  }

  const vulnerabilitiesQuery = getRepository(PackageVulnerability)
    .createQueryBuilder('pv')
    .where('pv.packageName in (:...packageNames)', { packageNames });

  return vulnerabilitiesQuery.getMany();
}

export async function getAffectingVulnerabilities(scanResult: ScanResult) {
  const affectingVulnerabilitiesByPackage: Record<string, PackageVulnerabilityData[]> = {};

  const packages = scanResult.packages;
  if (!packages.length) {
    return affectingVulnerabilitiesByPackage;
  }

  const packagesByNames = packages.reduce((acc, pkg) => {
    acc[pkg.name] = pkg;
    return acc;
  }, {} as Record<string, typeof packages[number]>);

  const vulnerabilitiesByPackage = await getVulnerabilitiesByPackageNames(
    Object.keys(packagesByNames)
  );

  for (const vulnerability of vulnerabilitiesByPackage) {
    const relatedPackage = packagesByNames[vulnerability.packageName]!;
    const affectsReportedRange = semver.subset(
      relatedPackage.versionRange,
      vulnerability.packageVersionRange,
      { loose: true }
    );

    if (!affectsReportedRange) {
      continue;
    }

    if (!affectingVulnerabilitiesByPackage[vulnerability.packageName]) {
      affectingVulnerabilitiesByPackage[vulnerability.packageName] = [];
    }

    const osvGithubDatabaseSpecific = vulnerability.osvData
      .database_specific as GithubAdvisoryDatabaseSpecific;

    affectingVulnerabilitiesByPackage[vulnerability.packageName].push({
      affectedPackageName: vulnerability.packageName,
      affectedVersionRange: vulnerability.packageVersionRange,
      osvId: vulnerability.osvId,
      detailsUrl: `https://github.com/advisories/${vulnerability.osvId}`,
      summary: vulnerability.osvData.summary,
      severity: osvGithubDatabaseSpecific.severity,
    });
  }

  return affectingVulnerabilitiesByPackage;
}
