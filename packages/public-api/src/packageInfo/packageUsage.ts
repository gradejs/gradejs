import { Hostname, PackageUsageByHostnameProjection, WebPageScan } from '@gradejs-public/shared';
import { createQueryBuilder } from 'typeorm';

type Options = {
  limit?: number;
  countPackages?: boolean;
};

export function getPackageUsage(
  packageName: string,
  options?: { limit?: number }
): Promise<
  {
    hostname: string;
    packageName: string;
  }[]
>;
export function getPackageUsage(
  packageName: string,
  options: { limit?: number; countPackages: true }
): Promise<
  {
    hostname: string;
    packageName: string;
    hostnamePackagesCount: number;
  }[]
>;
export function getPackageUsage(packageName: string, options: Options = {}) {
  const { limit = 4, countPackages = false } = options;

  const query = createQueryBuilder()
    .select('hostname.hostname', 'hostname')
    .addSelect('package_name', 'packageName')

    .from(
      (subQuery) =>
        subQuery
          .select()
          .distinctOn(['hostname_id'])
          .from(PackageUsageByHostnameProjection, 'usage')
          .where('package_name = :packageName', { packageName }),
      'distinct_usage'
    )
    .leftJoin(Hostname, 'hostname', 'hostname.id = distinct_usage.hostname_id')
    .where('package_name = :packageName', { packageName })
    .orderBy('hostname.global_rank', 'ASC', 'NULLS LAST')
    .limit(limit);

  if (countPackages) {
    query
      .leftJoin(WebPageScan, 'sourceScan', 'sourceScan.id = distinct_usage.source_scan_id')
      .addSelect(
        'jsonb_array_length(("sourceScan"."scan_result"->>\'identifiedPackages\')::jsonb)',
        'hostnamePackagesCount'
      );
  }

  return query.getRawMany();
}
