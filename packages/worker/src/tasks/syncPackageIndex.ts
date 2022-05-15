import { internalApi, queueWorkerTask } from '@gradejs-public/shared';

const PKG_SYNC_BATCH_LIMIT = 50;

/**
 * Retrieves data slices from the internal API and schedules batch worker tasks.
 * Look into `syncPackageIndexBatch` for the implementation.
 */
export async function syncPackageIndex() {
  const { pagination } = await internalApi.fetchPackageIndex();
  const promises: Promise<unknown>[] = [];

  for (let offset = 0; offset < pagination.total; offset += PKG_SYNC_BATCH_LIMIT) {
    promises.push(
      internalApi
        .fetchPackageIndex(offset, PKG_SYNC_BATCH_LIMIT)
        .then(({ packages }) => queueWorkerTask('syncPackageIndexBatch', packages))
    );
  }

  await Promise.all(promises);
}
