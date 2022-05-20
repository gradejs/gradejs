import semver from 'semver';
import { fetchPackageMetadata, fetchPackageDownloads } from './api';

// Requesting the NPM registry may cause some delays
jest.setTimeout(15000);

describe('npmRegistry / api', () => {
  it('fetchPackageMetadata', async () => {
    const metadata = await fetchPackageMetadata('object-assign');

    expect(semver.gte(metadata.latestVersion, '4.1.1')).toBeTruthy();
    expect(metadata.versionList).toContain('4.1.0');
    expect(metadata.updatedAt > new Date(2010, 1, 1)).toBeTruthy();
    expect(metadata.updateSeq > 100_000).toBeTruthy();
  });

  it('fetchPackageDownloads', async () => {
    const stats = await fetchPackageDownloads('object-assign');

    expect(stats.downloads).toBeGreaterThan(1_000_000);
  });
});
