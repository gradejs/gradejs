import { getRepository } from 'typeorm';
import {
  PackageMetadata,
  PackageUsageByHostnameProjection,
  PackagePopularityView,
  PackageVulnerability,
  toSerializable,
} from '@gradejs-public/shared';

export async function getPackageSummaryByName(packageName: string) {
  const packageRepo = getRepository(PackageMetadata);
  const packageUsageRepo = getRepository(PackageUsageByHostnameProjection);
  const packagePopularityRepo = getRepository(PackagePopularityView);
  const packageVulnerabilities = getRepository(PackageVulnerability);

  const queries = [
    packageRepo.createQueryBuilder().where('name = :packageName', { packageName }),
    packageUsageRepo
      .createQueryBuilder('usage')
      .leftJoinAndSelect('usage.hostname', 'hostname')
      .leftJoinAndSelect('usage.sourceScan', 'sourceScan')
      .where('package_name = :packageName', { packageName })
      .limit(16), // TODO: remove hardcode
    packagePopularityRepo
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName }),
    packageVulnerabilities
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName }),
  ];

  const [[packageInfo], usage, [popularity], vulnerabilities] = (await Promise.all(
    queries.map((q) => q.getMany())
  )) as [
    PackageMetadata[],
    PackageUsageByHostnameProjection[],
    PackagePopularityView[],
    PackageVulnerability[]
  ];

  if (!packageInfo) {
    return null;
  }

  return {
    ...toSerializable(packageInfo),
    versionSpecificValues: Object.fromEntries(
      Object.entries(packageInfo.versionSpecificValues ?? {}).filter(
        // remove non-release versions from output, keep the latest one
        ([version]) => packageInfo.latestVersion === version || version.match(/^\d+\.\d+\.\d+$/)
      )
    ),
    popularity: {
      total: popularity?.usageByHostnameCount ?? 0,
      byVersion: popularity?.versionPopularity ?? [],
    },
    usage: usage.map((u) => toSerializable(u)),
    vulnerabilities: vulnerabilities.map((v) => toSerializable(v)),
  };
}
