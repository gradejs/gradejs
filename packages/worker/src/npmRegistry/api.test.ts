import semver from 'semver';
import { fetchPackageMetadata, fetchPackageDownloads, getRepositoryUrl } from './api';

// Requesting the NPM registry may cause some delays
jest.setTimeout(30000);

// TODO: The replicate npm registry may be down sometimes and these tests are flaky
describe.skip('npmRegistry / api', () => {
  it('fetchPackageMetadata', async () => {
    const metadata = await fetchPackageMetadata('react');

    expect(semver.gte(metadata.latestVersion, '18.0.0')).toBeTruthy();
    expect(metadata.repositoryUrl).toEqual('https://github.com/facebook/react');
    expect(metadata.homepageUrl).toEqual('https://reactjs.org/');
    expect(metadata.description).toContain('React');
    expect(metadata.license).toEqual('MIT');
    expect(metadata.versionList).toContain('17.0.0');
    expect(metadata.updatedAt > new Date(2010, 1, 1)).toBeTruthy();
    expect(metadata.updateSeq > 100_000).toBeTruthy();
  });

  it('fetchPackageDownloads', async () => {
    const stats = await fetchPackageDownloads('object-assign');

    expect(stats.downloads).toBeGreaterThan(1_000_000);
  });
});

describe('npmRegistry / getRepositoryUrl', () => {
  it.each([
    ['git+https://github.com/facebook/react.git', 'https://github.com/facebook/react'],
    ['https://github.com/facebook/react', 'https://github.com/facebook/react'],
    ['git://github.com/auth0/lock', 'https://github.com/auth0/lock'],
    ['github:foo/bar', 'https://github.com/foo/bar'],
    ['gitlab:foo/bar', 'https://gitlab.com/foo/bar'],
    ['bitbucket:foo/bar', 'https://bitbucket.org/foo/bar'],
  ])('should give valid url', (target, result) => {
    expect(getRepositoryUrl(target)).toEqual(result);
  });
});
