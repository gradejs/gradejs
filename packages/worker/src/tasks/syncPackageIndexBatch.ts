import semver from 'semver';
import { internalApi, Internal, PackageMetadata } from '@gradejs-public/shared';
import { fetchPackageStatsAndMetadata } from '../npmRegistry/api';

export async function syncPackageIndexBatch(payload: Internal.Package[]) {
  // We do not need any concurrent limits here since the batch size
  // is controlled by the `syncPackageIndex` task.
  await Promise.all(payload.map((item) => syncPackage(item.name, item.latestVersion)));
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
async function syncPackage(name: string, latestIndexedVersion?: string) {
  const statsAndMetadata = await fetchPackageStatsAndMetadata(name);

  if (latestIndexedVersion) {
    const versionsUnsynced = statsAndMetadata.versionList.filter((version) =>
      semver.gt(version, latestIndexedVersion)
    );

    if (versionsUnsynced.length > 0) {
      const packagesToBeIndexed = versionsUnsynced.map((version) => `${name}@${version}`);
      await internalApi.requestPackageIndexing(packagesToBeIndexed);
    }
  }

  await PackageMetadata.upsert(
    {
      name: name,
      latestVersion: statsAndMetadata.latestVersion,
      updateSeq: statsAndMetadata.updateSeq,
      updatedAt: statsAndMetadata.updatedAt,
    },
    ['name']
  );
}
