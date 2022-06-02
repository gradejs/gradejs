import { getGitHubAccessToken } from '@gradejs-public/shared';
import { Octokit } from '@octokit/core';
import fetch from 'node-fetch';

const GITHUB_ADVISORY_DB_PUBLIC_TARBALL =
  'https://github.com/github/advisory-database/archive/refs/heads/main.tar.gz';

const GITHUB_ADVISORY_DB_API_PARAMS = {
  owner: 'github',
  repo: 'advisory-database',
  ref: 'main',
};

export async function fetchAdvisoryDbSnapshot() {
  const githubAccessToken = getGitHubAccessToken();

  let tarballUrl = GITHUB_ADVISORY_DB_PUBLIC_TARBALL;

  if (githubAccessToken) {
    const oktokit = new Octokit({ auth: githubAccessToken });
    const response = await oktokit.request(
      'GET /repos/{owner}/{repo}/tarball/{ref}',
      GITHUB_ADVISORY_DB_API_PARAMS
    );

    tarballUrl = response.url;
  }

  const tarballResponse = await fetch(tarballUrl);

  return tarballResponse.body;
}
