import { getRepository, createQueryBuilder } from 'typeorm';
import {
  PackageMetadata,
  PackagePopularityView,
  PackageVulnerability,
  toSerializable,
} from '@gradejs-public/shared';
import semver from 'semver';

export async function getPackageSummaryByName(packageName: string) {
  const packageRepo = getRepository(PackageMetadata);
  const packagePopularityRepo = getRepository(PackagePopularityView);
  const packageVulnerabilities = getRepository(PackageVulnerability);

  const queries: [
    Promise<PackageMetadata[]>,
    Promise<{ hostnamePackagesCount: number; hostname: string; packageName: string }[]>,
    Promise<number>,
    Promise<PackagePopularityView[]>,
    Promise<PackageVulnerability[]>
  ] = [
    packageRepo.createQueryBuilder().where('name = :packageName', { packageName }).getMany(),
    createQueryBuilder()
      .select()
      .from('package_usage_by_hostname_projection', 'usage')
      .leftJoin('usage.hostname', 'hn')
      .addSelect('package_name', 'packageName')
      .addSelect('hn.hostname', 'hostname')
      .leftJoin('usage.sourceScan', 'sourceScan')
      .addSelect(
        'jsonb_array_length(("sourceScan"."scan_result"->>\'identifiedPackages\')::jsonb)',
        'hostnamePackagesCount'
      )
      .where('package_name = :packageName', { packageName })
      .limit(16) // TODO: remove hardcode
      .getRawMany(),
    createQueryBuilder()
      .select()
      .from('package_usage_by_hostname_projection', 'usage')
      .where('package_name = :packageName', { packageName })
      .getCount(),
    packagePopularityRepo
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName })
      .getMany(),
    packageVulnerabilities
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName })
      .getMany(),
  ];

  const [[packageInfo], usage, usageByHostnameCount, [popularity], vulnerabilities] =
    await Promise.all(queries);

  if (!packageInfo) {
    return null;
  }

  return {
    ...toSerializable(packageInfo),
    updateDate: packageInfo.versionSpecificValues?.[packageInfo.latestVersion]?.updateDate,
    deps: Object.keys(
      packageInfo.versionSpecificValues?.[packageInfo.latestVersion]?.dependencies ?? {}
    ),
    versionSpecificValues: Object.fromEntries(
      Object.entries(packageInfo.versionSpecificValues ?? {})
        .filter(
          // remove non-release versions from output, keep the latest one
          ([version]) => packageInfo.latestVersion === version || version.match(/^\d+\.\d+\.\d+$/)
        )
        .map(([version, data]) => [
          version,
          {
            ...data,
            isVulnerable: vulnerabilities.some((v) =>
              semver.satisfies(version, v.packageVersionRange)
            ),
            uses:
              popularity?.versionPopularity?.find((item) => item.package_version === version)
                ?.count ?? 0,
          },
        ])
    ),
    usage: usage.map((u) => toSerializable(u)),
    vulnerabilities: vulnerabilities.map((v) => toSerializable(v)),
    usageByHostnameCount,
  };
}
