import { fetchAdvisoryDbSnapshot } from '../githubAdvisoryDb/advisoryDb';
import gunzip from 'gunzip-maybe';
import TarStream from 'tar-stream';
import Stream from 'node:stream';
import { pipeline } from 'node:stream/promises';
import {
  OpenSourceVulnerability,
  OSVAffectedRangeType,
  PackageVulnerability,
} from '@gradejs-public/shared';
import { PipelineDestination } from 'stream';

type PackageVulnerabilityData = Pick<
  PackageVulnerability,
  'packageName' | 'packageVersionRange' | 'osvId' | 'osvData'
>;

async function drainStreamToBuffer(stream: Stream.Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const dataChunks: any[] = [];

    stream.on('data', (chunk) => dataChunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(dataChunks)));
    stream.on('error', (err) => reject(err));

    stream.resume();
  });
}

function createBatchingVulnerabilitySynchronizer(batchSize = 10) {
  const entityBuffer: PackageVulnerabilityData[] = [];

  const flush = async () => {
    await PackageVulnerability.upsert(entityBuffer, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['packageName', 'osvId'],
    });
    entityBuffer.splice(0, entityBuffer.length);
  };

  const upsert = async (osvData: OpenSourceVulnerability | null) => {
    if (osvData === null) {
      await flush();
      return;
    }

    const affectedEntries = osvData.affected?.filter((it) => it.package.ecosystem === 'npm');
    if (!affectedEntries?.length) {
      return;
    }

    const affectedRangesByPackage: Record<string, string[]> = {};

    for (const affectedEntry of affectedEntries) {
      const affectedRanges = affectedEntry.ranges?.filter(
        (it) => it.type === OSVAffectedRangeType.ECOSYSTEM
      );
      if (!affectedRanges) {
        continue;
      }

      const affectedRangeParts = [];
      for (const range of affectedRanges) {
        const introducedVer = range.events.find((it) => !!it.introduced);
        const fixedVer = range.events.find((it) => !!it.fixed);

        if (introducedVer && fixedVer) {
          affectedRangeParts.push(`>=${introducedVer.introduced} <${fixedVer.fixed}`);
        }

        if (introducedVer && !fixedVer) {
          affectedRangeParts.push(`>=${introducedVer.introduced}`);
        }
      }

      const affectedVersions = affectedEntry.versions;
      if (affectedVersions) {
        affectedRangeParts.push(...affectedVersions);
      }

      if (!affectedRangeParts.length) {
        continue;
      }

      if (!affectedRangesByPackage[affectedEntry.package.name]) {
        affectedRangesByPackage[affectedEntry.package.name] = affectedRangeParts;
      } else {
        affectedRangesByPackage[affectedEntry.package.name].push(...affectedRangeParts);
      }
    }

    const osvEntries = Object.entries(affectedRangesByPackage).map(
      ([packageName, affectedRanges]) => ({
        packageName,
        packageVersionRange: affectedRanges.join(', '),
        osvId: osvData.id,
        osvData: osvData,
      })
    );

    entityBuffer.push(...osvEntries);

    if (entityBuffer.length >= batchSize) {
      await flush();
    }
  };

  return { upsert, flush };
}

export async function syncPackageVulnerabilities() {
  const vulnerabilitySynchronizer = createBatchingVulnerabilitySynchronizer();
  const extractStream = TarStream.extract();

  extractStream.on('entry', async (header, stream, next) => {
    // Example path: advisory-database-main/advisories/github-reviewed/2022/05/GHSA-23wx-cgxq-vpwx/GHSA-23wx-cgxq-vpwx.json
    const filePath = header.name;

    const isReviewed = filePath.includes('advisories/github-reviewed');

    if (!isReviewed || !filePath.endsWith('.json')) {
      // Stream has to drained to continue
      stream.on('end', () => next());
      stream.resume();
      return;
    }

    const fileBuffer = await drainStreamToBuffer(stream);
    const fileContents = fileBuffer.toString();

    const osvData = JSON.parse(fileContents) as OpenSourceVulnerability;

    await vulnerabilitySynchronizer.upsert(osvData);

    next();
  });

  const dbSnapshotStream = await fetchAdvisoryDbSnapshot();
  const pipelineResult = await pipeline(
    dbSnapshotStream,
    gunzip(),
    extractStream as PipelineDestination<any, any> // explicit typing to select proper override
  );

  await vulnerabilitySynchronizer.flush(); // Flush the last batch

  return pipelineResult;
}
