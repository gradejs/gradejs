import concurrently from 'tiny-async-pool';
import { systemApi, queueWorkerTask, logger } from '@gradejs-public/shared';

const PKG_SYNC_BATCH_LIMIT = 50;
const PKG_SYNC_PARALLEL_LIMIT = 10;

/**
 * Retrieves data slices from the internal API and schedules batch worker tasks.
 * Look into `syncPackageIndexBatch` for the implementation.
 */
export async function syncPackageIndex() {
  const { pagination } = await systemApi.fetchPackageIndex();

  let processed = 0;
  const batchesTotal = Math.ceil(pagination.total / PKG_SYNC_BATCH_LIMIT);
  const offsets = new Array(batchesTotal).fill(0).map((_, i) => i * PKG_SYNC_BATCH_LIMIT);

  async function processBatch(offset: number) {
    const { packages } = await systemApi.fetchPackageIndex(offset, PKG_SYNC_BATCH_LIMIT);
    await queueWorkerTask('syncPackageIndexBatch', packages);
    processed++;
  }

  await concurrently(PKG_SYNC_PARALLEL_LIMIT, offsets, processBatch).catch((e: Error) =>
    logger.error(
      `syncPackageIndex task is aborted, only ${processed} out of ${batchesTotal} batches are processed:` +
        `\n${e.message}\n${e.stack}`
    )
  );
}
