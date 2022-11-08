import {
  getDatabaseConnection,
  PackageMetadata,
  PackageUsageByHostnameProjection,
  WebPageScan,
} from '@gradejs-public/shared';
import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import { findOrCreateWebPage } from '../website/service';
import { refreshPackagePopularityView } from '../projections/refreshPackagePopularityView';
import { searchEntitiesByName } from './searchService';

useDatabaseConnection();
useTransactionalTesting();

describe('search / searchService', () => {
  it('should search for packages and hostnames by partial name', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const mockHostname = 'test-mock.example.com';
    const mockWebPagePath = '/testpage';
    const mockPackageName = 'mock-showcased-package';

    const packageMetadataRepo = em.getRepository(PackageMetadata);
    const scanRepo = em.getRepository(WebPageScan);
    const packageUsageRepo = em.getRepository(PackageUsageByHostnameProjection);

    const mockPage = await findOrCreateWebPage(
      new URL(`https://${mockHostname}${mockWebPagePath}`),
      em
    );

    await packageMetadataRepo.save({
      name: mockPackageName,
      description: 'mock showcased package description',
      latestVersion: '1.0.1',
      monthlyDownloads: 123,
      maintainers: [{ name: 'test', avatar: 'test.jpg', email: 'test@test.com' }],
      keywords: ['#react', '#react2'],
      updateSeq: 1,
      updatedAt: new Date().toString(),
    });

    const mockScan = await scanRepo.save({
      webPage: mockPage,
      status: WebPageScan.Status.Processed,
      createdAt: new Date(Date.now() - 100),
      finishedAt: new Date(Date.now()),
      scanResult: {
        identifiedModuleMap: {},
        identifiedPackages: [
          {
            name: mockPackageName,
            versionSet: ['1.0.1'],
            moduleIds: [],
          },
        ],
      },
    });

    await packageUsageRepo.save({
      hostname: mockPage.hostname,
      hostnameId: mockPage.hostnameId,
      sourceScan: mockScan,
      sourceScanId: mockScan.id,
      packageName: mockPackageName,
      packageVersionSet: ['1.0.1'],
    });

    await refreshPackagePopularityView();

    const searchResults = await searchEntitiesByName('mock');

    expect(searchResults).toMatchObject({
      scans: [{ hostname: 'test-mock.example.com', path: '/testpage', packageCount: 1 }],
      packages: [
        {
          name: 'mock-showcased-package',
          description: 'mock showcased package description',
        },
      ],
    });
  });
});
