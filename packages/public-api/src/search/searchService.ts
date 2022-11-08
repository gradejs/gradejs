import { getRepository } from 'typeorm';
import { Hostname, PackagePopularityView } from '@gradejs-public/shared';

const ESCAPED_SEARCH_SYMBOLS_REGEXP = /[%_]/g;
const SEARCH_RESULT_PER_ENTITY_LIMIT = 3;

export async function searchEntitiesByName(namePartial: string) {
  const filteredNamePartial = namePartial
    .toLowerCase()
    .replace(ESCAPED_SEARCH_SYMBOLS_REGEXP, (match) => `\\${match}`);

  if (!filteredNamePartial.length) {
    return { scans: [], packages: [] };
  }

  const packagePopularityViewRepo = getRepository(PackagePopularityView);
  const hostnameRepo = getRepository(Hostname);

  const packageSearchQuery = packagePopularityViewRepo
    .createQueryBuilder('package')
    .select('package.packageName', 'name')
    .leftJoin('package.packageMetadata', 'packageMetadata')
    .addSelect('packageMetadata.description', 'description')
    .where('package.packageName like :namePartial', { namePartial: `%${filteredNamePartial}%` })
    .orderBy('package.usageByHostnameCount', 'DESC')
    .limit(SEARCH_RESULT_PER_ENTITY_LIMIT)
    .getRawMany<{ name: string; description: string }>();

  const scanSearchQuery = hostnameRepo
    .createQueryBuilder('hostname')
    .distinctOn(['hostname.hostname', 'hostname.globalRank'])
    .select('hostname.hostname', 'hostname')
    .innerJoin('hostname.webPages', 'webPage')
    .innerJoin('webPage.scans', 'scan')
    .addSelect('webPage.path', 'path')
    .addSelect(
      'jsonb_array_length(("scan"."scan_result"->>\'identifiedPackages\')::jsonb)',
      'packageCount'
    )
    .where('hostname.hostname like :namePartial', { namePartial: `%${filteredNamePartial}%` })
    .addOrderBy('hostname.globalRank', 'DESC')
    .addOrderBy('hostname.hostname', 'DESC')
    .addOrderBy('scan.createdAt', 'DESC')
    .limit(SEARCH_RESULT_PER_ENTITY_LIMIT)
    .getRawMany<{ hostname: string; path: string; packageCount: number }>();

  const [packageSearchResults, scanSearchResults] = await Promise.all([
    packageSearchQuery,
    scanSearchQuery,
  ]);

  return {
    scans: scanSearchResults,
    packages: packageSearchResults,
  };
}
