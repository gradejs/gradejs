import { getRepository } from 'typeorm';
import { Hostname, PackagePopularityView } from '@gradejs-public/shared';

const ESCAPED_SEARCH_SYMBOLS_REGEXP = /[%_]/g;
const SEARCH_RESULT_PER_ENTITY_LIMIT = 3;

export async function searchEntitiesByName(namePartial: string) {
  const filteredNamePartial = namePartial
    .toLowerCase()
    .replace(ESCAPED_SEARCH_SYMBOLS_REGEXP, (match) => `\\${match}`);

  if (!filteredNamePartial.length) {
    return { hostnames: [], packages: [] };
  }

  const packagePopularityViewRepo = getRepository(PackagePopularityView);
  const hostnameRepo = getRepository(Hostname);

  const packageSearchQuery = packagePopularityViewRepo
    .createQueryBuilder('package')
    .select('package.packageName')
    .where('package.packageName like :namePartial', { namePartial: `%${filteredNamePartial}%` })
    .orderBy('package.usageByHostnameCount', 'DESC')
    .limit(SEARCH_RESULT_PER_ENTITY_LIMIT)
    .getMany();

  const hostnameSearchQuery = hostnameRepo
    .createQueryBuilder('hostname')
    .select('hostname.hostname')
    .where('hostname.hostname like :namePartial', { namePartial: `%${filteredNamePartial}%` })
    .orderBy('hostname.globalRank', 'DESC')
    .limit(SEARCH_RESULT_PER_ENTITY_LIMIT)
    .getMany();

  const [packageSearchResults, hostnameSearchResults] = await Promise.all([
    packageSearchQuery,
    hostnameSearchQuery,
  ]);

  return {
    hostnames: hostnameSearchResults,
    packages: packageSearchResults,
  };
}
