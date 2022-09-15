import { systemApi, PackageMetadata } from '@gradejs-public/shared';
import { fetchPackageStatsAndMetadata } from '../npmRegistry/api';

export async function syncPackageIndexBatch(payload: systemApi.PackageRequest[]) {
  // We do not need any concurrent limits here since the batch size
  // is controlled by the `syncPackageIndex` task.
  await Promise.all(payload.map((item) => syncPackage(item.name)));
}

/**
 * In order to sync a single package we need:
 * - Fetch actual metadata from the NPM APIs
 * - Add new packages to the internal API package index
 * - Update the `PackageMetadata` table
 *
 * We could've make a single `requestPackageIndexing` request and an `upsert` query
 * by merging results on the `syncPackageIndexBatch` level, however for the sake of simplicity
 * and code readability, we've decided extract everthing into a single function, since
 * package sync happens rarely.
 */
async function syncPackage(name: string) {
  const statsAndMetadata = await fetchPackageStatsAndMetadata(name);

  await Promise.all([
    systemApi.requestPackageIndexing({
      name,
      versions: Object.keys(statsAndMetadata.versionSpecificValues),
    }),
    PackageMetadata.upsert(
      {
        name: name,
        latestVersion: statsAndMetadata.latestVersion,
        description: statsAndMetadata.description,
        fullDescription: statsAndMetadata.fullDescription,
        maintainers: statsAndMetadata.maintainers,
        keywords: statsAndMetadata.keywords,
        homepageUrl: statsAndMetadata.homepageUrl,
        repositoryUrl: statsAndMetadata.repositoryUrl,
        license: statsAndMetadata.license,
        versionSpecificValues: statsAndMetadata.versionSpecificValues,
        monthlyDownloads: statsAndMetadata.downloads,
        updateSeq: statsAndMetadata.updateSeq,
        updatedAt: statsAndMetadata.updatedAt,
      },
      ['name']
    ),
  ]);
}
