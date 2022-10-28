import { getRepository, createQueryBuilder } from 'typeorm';
import {
  PackageMetadata,
  PackagePopularityView,
  PackageVulnerability,
  toSerializable,
} from '@gradejs-public/shared';

const simpleVersionRegex = /^\d+\.\d+\.\d+$/;

export async function getPackageSummaryByName(packageName: string) {
  const packageRepo = getRepository(PackageMetadata);
  const packagePopularityRepo = getRepository(PackagePopularityView);
  const packageVulnerabilities = getRepository(PackageVulnerability);

  const queries: [
    Promise<PackageMetadata | undefined>,
    Promise<{ hostnamePackagesCount: number; hostname: string; packageName: string }[]>,
    Promise<PackagePopularityView | undefined>,
    Promise<PackageVulnerability[]>
  ] = [
    packageRepo
      .createQueryBuilder('metadata')
      .addSelect('metadata.full_description', 'metadata_full_description')
      .addSelect('metadata.version_specific_values', 'metadata_version_specific_values')
      .where('name = :packageName', { packageName })
      .getOne(),
    createQueryBuilder()
      .select()
      .distinctOn(['usage.hostname_id'])
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
      .orderBy('usage.hostname_id')
      .addOrderBy('hn.global_rank', 'ASC', 'NULLS LAST')
      .limit(16) // TODO: remove hardcode
      .getRawMany(),
    packagePopularityRepo
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName })
      .getOne(),
    packageVulnerabilities
      .createQueryBuilder()
      .where('package_name = :packageName', { packageName })
      .getMany(),
  ];

  const [packageInfo, usage, popularity, vulnerabilities] = await Promise.all(queries);

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
          ([version]) => packageInfo.latestVersion === version || version.match(simpleVersionRegex)
        )
        .map(([version, data]) => [
          version,
          {
            ...data,
            uses:
              popularity?.versionPopularity?.find((item) => item.package_version === version)
                ?.count ?? 0,
          },
        ])
    ),
    usage: usage.map((u) => toSerializable(u)),
    vulnerabilities: vulnerabilities.map((v) => toSerializable(v)),
    usageByHostnameCount: popularity?.usageByHostnameCount,
  };
}
