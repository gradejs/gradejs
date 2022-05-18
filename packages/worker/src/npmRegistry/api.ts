import nano from 'nano';
import fetch from 'node-fetch';

// We use the relicate API since the `registry.npmjs.com`
// does not support `local_seq` parameter and the `/changes` endpoint.
const REGISTRY_URL = 'https://replicate.npmjs.com';
const NPM_API_ORIGIN = 'https://api.npmjs.org';

type DocumentScope = {
  time: {
    modified: string;
    created: string;
    [version: string]: string;
  };
  'dist-tags': {
    latest: string;
  };
  versions: Record<string, Record<string, unknown>>;
};

const registry = nano(REGISTRY_URL).scope<DocumentScope>('registry');

export async function fetchPackageMetadata(name: string) {
  const document = await registry.get(name, { local_seq: true });
  const versionList = Object.keys(document.versions);

  return {
    updateSeq: Number(document._local_seq),
    updatedAt: new Date(document.time.modified),
    latestVersion: document['dist-tags'].latest,
    versionList,
  };
}

type DownloadsResponse = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};

export async function fetchPackageDownloads(name: string): Promise<DownloadsResponse> {
  return fetch(`${NPM_API_ORIGIN}/downloads/point/last-month/${name}`).then((response) =>
    response.json()
  );
}

export async function fetchPackageStatsAndMetadata(name: string) {
  const [stats, metadata] = await Promise.all([
    fetchPackageDownloads(name),
    fetchPackageMetadata(name),
  ]);

  return {
    ...stats,
    ...metadata,
  };
}
