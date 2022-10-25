import nano from 'nano';
import { createHash } from 'crypto';
import fetch from 'node-fetch';
import { VersionData } from '@gradejs-public/shared';

// We use the relicate API since the `registry.npmjs.com`
// does not support `local_seq` parameter and the `/changes` endpoint.
const REGISTRY_URL = 'https://replicate.npmjs.com';
const NPM_API_ORIGIN = 'https://api.npmjs.org';
const makeAvatarUrl = (email: string) =>
  `https://s.gravatar.com/avatar/${createHash('md5').update(email).digest('hex')}`;

type DocumentScope = {
  description?: string;
  readme?: string;
  maintainers?: Array<{ name: string; email: string }>;
  keywords?: string[];
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
  versions?: Record<
    string,
    {
      dependencies?: Record<string, string>;
      readme?: string;
      peerDependencies?: Record<string, string>;
      dist: {
        unpackedSize?: number;
        fileCount?: number;
      };
    }
  >;
};

const registry = nano(REGISTRY_URL).scope<DocumentScope>('registry');

export async function fetchPackageMetadata(name: string) {
  const document = await registry.get(name, { local_seq: true });
  const versionList = Object.keys(document.versions ?? {});

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
    description: document.description,
    fullDescription: document.readme
      ? document.readme
      : document.versions?.[document['dist-tags'].latest]?.readme,
    maintainers: (document.maintainers ?? []).map((author) => ({
      name: author.name,
      email: author.email,
      avatar: makeAvatarUrl(author.email),
    })),
    keywords: document.keywords ?? [],
    license: document.license,
    homepageUrl,
    repositoryUrl,
    updateSeq: Number(document._local_seq),
    updatedAt: new Date(document.time.modified),
    latestVersion: document['dist-tags'].latest,
    versionSpecificValues: versionList.reduce((acc, el) => {
      acc[el] = {
        dependencies: {
          ...(document.versions?.[el].dependencies ?? {}),
          ...(document.versions?.[el].peerDependencies ?? {}),
        },
        unpackedSize: document.versions?.[el].dist.unpackedSize,
        updateDate: new Date(document.time[el]),
        registryModulesCount: document.versions?.[el].dist.fileCount,
      };
      return acc;
    }, {} as Record<string, VersionData>),
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
  if (!repository) {
    return;
  }

  let urlMatch;

  // (git+)https://github.com/facebook/react(.git)
  if ((urlMatch = repository.match(/^(?:git\+)?(https?:.*?)(?:\.git)?$/))) {
    const [, repoUrl] = urlMatch;
    return repoUrl;
  }

  // git://github.com/auth0/lock(.git)
  if ((urlMatch = repository.match(/^git:\/\/(.*?)(?:.git)?$/))) {
    const [, repoUrl] = urlMatch;
    return `https://${repoUrl}`;
  }

  // github:user/repo
  if ((urlMatch = repository.match(/^(\w+):([\w_\-\.]+)\/([\w_\-\.]+)$/))) {
    const [, repoType, repoUser, repoName] = urlMatch;
    switch (repoType) {
      case 'github':
        return `https://github.com/${repoUser}/${repoName}`;

      case 'gitlab':
        return `https://gitlab.com/${repoUser}/${repoName}`;

      case 'bitbucket':
        return `https://bitbucket.org/${repoUser}/${repoName}`;

      default:
    }
  }

  return repository;
}
