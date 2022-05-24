import semver from 'semver';
import { fetchPackageMetadata, fetchPackageDownloads } from './api';

// Requesting the NPM registry may cause some delays
jest.setTimeout(30000);

describe('npmRegistry / api', () => {
  it('fetchPackageMetadata', async () => {
    const metadata = await fetchPackageMetadata('react');

    expect(semver.gte(metadata.latestVersion, '18.0.0')).toBeTruthy();
    expect(metadata.versionList).toContain('17.0.0');
    expect(metadata.versionList).not.toContain('18.0.0-alpha-00ced1e2b-20211102');
    expect(metadata.updatedAt > new Date(2010, 1, 1)).toBeTruthy();
    expect(metadata.updateSeq > 100_000).toBeTruthy();
  });

  it('fetchPackageDownloads', async () => {
    const stats = await fetchPackageDownloads('object-assign');

    expect(stats.downloads).toBeGreaterThan(1_000_000);
  });
});
