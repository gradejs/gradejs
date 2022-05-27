import nano from 'nano';
import fetch from 'node-fetch';

// We use the relicate API since the `registry.npmjs.com`
// does not support `local_seq` parameter and the `/changes` endpoint.
const REGISTRY_URL = 'https://replicate.npmjs.com';
const NPM_API_ORIGIN = 'https://api.npmjs.org';

type DocumentScope = {
  description?: string;
  license?: string;
  homepage?: string;
  repository?:
    | string
    | {
        type?: string;
        directory?: string;
        url?: string;
      };
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

  let homepageUrl, repositoryUrl;

  if (document.homepage && isValidUrl(document.homepage)) {
    homepageUrl = document.homepage;
  }

  if (typeof document.repository === 'string') {
    repositoryUrl = getRepositoryUrl(document.repository);
  }

  if (typeof document.repository === 'object') {
    repositoryUrl = getRepositoryUrl(document.repository.url);
  }

  // TODO: reconsider this part, since currently the internal API filters version by itself
  // Filter out intermediate versions such as X.Y.Z-dev-0 and include only stable ones
  // const versionListFiltered = versionList.filter(
  //   (item: string) => item.search(/^(\d+\.)?(\d+\.)?(\d+)$/) > -1
  // );

  return {
    description: document.description || undefined,
    license: document.license || undefined,
    homepageUrl,
    repositoryUrl,
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

function isValidUrl(maybeUrl: string) {
  let url;

  try {
    url = new URL(maybeUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function getRepositoryUrl(repository?: string) {
  let url;

  if (!repository) {
    return;
  }

  // (git+)https://github.com/facebook/react(.git)
  if ((url = repository.match(/^(?:git\+)?(https?:.*?)(?:\.git)?$/))) {
    return url[1];
  }

  // git://github.com/auth0/lock(.git)
  if ((url = repository.match(/^git:\/\/(.*?)(?:.git)?$/))) {
    return `https://${url[1]}`;
  }

  // github:user/repo
  if ((url = repository.match(/^(\w+):([\w_\-\.]+)\/([\w_\-\.]+)$/))) {
    switch (url[1]) {
      case 'github':
        return `https://github.com/${url[2]}/${url[3]}`;

      case 'gitlab':
        return `https://gitlab.com/${url[2]}/${url[3]}`;

      case 'bitbucket':
        return `https://bitbucket.org/${url[2]}/${url[3]}`;

      default:
    }
  }

  return repository;
}
