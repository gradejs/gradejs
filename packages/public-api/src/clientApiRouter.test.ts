import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import {
  getDatabaseConnection,
  Hostname,
  ScansWithVulnerabilitiesProjection,
  ShowcasedWebPage,
  PackageMetadata,
  systemApi,
  WebPage,
  WebPageScan,
  PackageVulnerability,
  PackageUsageByHostnameProjection,
  ShowcasedPackage,
} from '@gradejs-public/shared';
import {
  createSupertestApi,
  useDatabaseConnection,
  useTransactionalTesting,
} from '@gradejs-public/test-utils';
import { getRepository } from 'typeorm';
import { createApp } from './app';
import { findOrCreateWebPage } from './website/service';
import { refreshPackagePopularityView } from './projections/refreshPackagePopularityView';

useDatabaseConnection();
useTransactionalTesting();

const api = createSupertestApi(createApp);

jest.setTimeout(600000);

describe('routes / heathCheck', () => {
  it('should return valid response for healthcheck path', async () => {
    await api.get('/').send().expect(200);
  });

  it('should return not found client error', async () => {
    const response = await api
      .get('/client/any-invalid-route')
      .set('Origin', 'http://localhost:3000')
      .send()
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: TRPC_ERROR_CODES_BY_KEY.NOT_FOUND,
      },
    });
  });
});

describe('routes / website', () => {
  it('should initiate a webpage scan', async () => {
    const siteUrl = new URL('https://example.com/' + Math.random().toString());

    const requestWebPageScanMock = jest.spyOn(systemApi, 'requestWebPageScan');
    requestWebPageScanMock.mockImplementation(async () => ({}));

    const response = await api
      .post('/client/getOrRequestWebPageScan')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify({ url: siteUrl.toString(), rescan: true }))
      .expect(200);

    const hostname = await getRepository(Hostname).findOneOrFail({ hostname: siteUrl.hostname });

    expect(hostname).toMatchObject({
      hostname: siteUrl.hostname,
    });

    const webPage = await getRepository(WebPage)
      .createQueryBuilder('webpage')
      .where('webpage.hostname_id = :hostnameId', { hostnameId: hostname.id })
      .andWhere('webpage.path = :path', { path: siteUrl.pathname })
      .limit(1)
      .getOneOrFail();

    expect(webPage).toMatchObject({
      path: siteUrl.pathname,
    });

    const webPageScan = await getRepository(WebPageScan)
      .createQueryBuilder('scan')
      .where('scan.web_page_id = :webPageId', { webPageId: webPage.id })
      .getOneOrFail();

    expect(webPageScan).toMatchObject({
      status: WebPageScan.Status.Pending,
    });

    expect(requestWebPageScanMock).toHaveBeenCalledTimes(1);
    expect(requestWebPageScanMock).toHaveBeenCalledWith(
      siteUrl.toString(),
      webPageScan.id.toString()
    );

    expect(response.body).toMatchObject({
      result: {
        data: {
          id: webPageScan.id.toString(),
          status: WebPageScan.Status.Pending,
        },
      },
    });
  });

  it('should return a cached scan if applicable', async () => {
    const siteUrl = new URL(`https://${Math.random().toString()}.example.com/`);

    const requestWebPageScanMock = jest.spyOn(systemApi, 'requestWebPageScan');
    requestWebPageScanMock.mockImplementation(async () => ({}));

    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const webPage = await findOrCreateWebPage(siteUrl, em);
    const existingScan = await em.getRepository(WebPageScan).save({
      webPage,
      status: WebPageScan.Status.Processed,
      scanResult: {
        identifiedModuleMap: {},
        identifiedPackages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            moduleIds: [],
          },
        ],
        processedScripts: [],
        identifiedBundler: { name: 'webpack', versionRange: '5.x' },
      },
    });

    await em.getRepository(PackageMetadata).save({
      name: 'react',
      description: 'short description',
      fullDescription: 'full description',
      latestVersion: '17.0.1',
      monthlyDownloads: 9001,
      keywords: ['react'],
      updateSeq: 1,
    });

    const response = await api
      .post('/client/getOrRequestWebPageScan')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify({ url: siteUrl.toString(), rescan: false }))
      .expect(200);

    expect(requestWebPageScanMock).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
      result: {
        data: {
          id: existingScan.id.toString(),
          status: WebPageScan.Status.Processed,
          scanResult: {
            vulnerabilities: {},
            identifiedModuleMap: {},
            processedScripts: [],
            identifiedBundler: { name: 'webpack', versionRange: '5.x' },
            identifiedPackages: [
              {
                name: 'react',
                versionSet: ['17.0.0'],
                registryMetadata: {
                  name: 'react',
                  latestVersion: '17.0.1',
                  monthlyDownloads: 9001,
                  description: 'short description',
                  maintainers: [],
                  keywords: ['react'],
                  homepageUrl: null,
                  repositoryUrl: null,
                  license: null,
                  updateSeq: 1,
                  updatedAt: null,
                },
              },
            ],
          },
        },
      },
    });
  });

  it('should return correct package info', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const scanRepo = em.getRepository(WebPageScan);
    const packageInfoRepo = em.getRepository(PackageMetadata);
    const usageInfoRepo = em.getRepository(PackageUsageByHostnameProjection);
    const vulnerabilitiesRepo = em.getRepository(PackageVulnerability);

    const mockPkgname = 'react-hoist';
    const mockHostname = 'testtest123.com';
    const mockWebPagePath = '/testpage';

    const mockPage = await findOrCreateWebPage(
      new URL(`https://${mockHostname}${mockWebPagePath}`),
      em
    );

    await packageInfoRepo.save({
      id: 123,
      name: mockPkgname,
      latestVersion: '20.0.1',
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
            name: mockPkgname,
            versionSet: ['20.0.1'],
            moduleIds: [],
          },
        ],
      },
    });

    await usageInfoRepo.save({
      hostname: mockPage.hostname,
      hostnameId: mockPage.hostnameId,
      sourceScan: mockScan,
      sourceScanId: mockScan.id,
      packageName: mockPkgname,
      packageVersionSet: ['20.0.1'],
    });

    await vulnerabilitiesRepo.save({
      id: 123,
      packageName: mockPkgname,
      packageVersionRange: '17.0.1 - 18.0.0',
      osvId: 'GHSA-jf85-cpcp-j695',
      osvData: {
        schema_version: '1',
        id: '123',
        modified: new Date().toString(),
        summary:
          'React Editable Json Tree vulnerable to arbitrary code execution via function parsing',
        database_specific: { severity: 'Critical' },
      },
    });

    const url =
      '/client/getPackageInfo?input=' +
      encodeURIComponent(JSON.stringify({ packageName: mockPkgname }));
    const response = await api.get(url).set('Origin', 'http://localhost:3000').expect(200);

    expect(response.body).toMatchObject({
      result: {
        data: {
          name: 'react-hoist',
          latestVersion: '20.0.1',
          monthlyDownloads: 123,
          maintainers: [
            {
              name: 'test',
              email: 'test@test.com',
              avatar: 'test.jpg',
            },
          ],
          keywords: ['#react', '#react2'],
          usage: [
            {
              packageName: 'react-hoist',
              hostname: mockHostname,
              hostnamePackagesCount: 1,
            },
          ],
          vulnerabilities: [
            {
              packageName: 'react-hoist',
              packageVersionRange: '17.0.1 - 18.0.0',
              osvId: 'GHSA-jf85-cpcp-j695',
              osvData: {
                id: '123',
                summary:
                  'React Editable Json Tree vulnerable to arbitrary code execution via function parsing',
                schema_version: '1',
                database_specific: {
                  severity: 'Critical',
                },
              },
            },
          ],
        },
      },
    });
  });

  it('should return correct scan-related showcase dataset', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const scanRepo = em.getRepository(WebPageScan);
    const showcasedWebPagesRepo = em.getRepository(ShowcasedWebPage);
    const scansWithVulnerabilitiesRepo = em.getRepository(ScansWithVulnerabilitiesProjection);

    const mockHostname = 'test-mock.example.com';
    const mockWebPagePath = '/testpage';

    const mockPage = await findOrCreateWebPage(
      new URL(`https://${mockHostname}${mockWebPagePath}`),
      em
    );

    await scanRepo.save({
      webPage: mockPage,
      status: WebPageScan.Status.Processed,
      createdAt: new Date(Date.now() - 2000),
      finishedAt: new Date(Date.now() - 1000),
      scanResult: {
        identifiedModuleMap: {},
        identifiedPackages: [
          {
            name: 'mock-package-one',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
        ],
      },
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
            name: 'mock-package-one',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-two',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-three',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-four',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-five',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-six',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
          {
            name: 'mock-package-seven',
            versionSet: ['1.0.0'],
            moduleIds: [],
          },
        ],
      },
    });

    await scansWithVulnerabilitiesRepo.save({
      sourceScan: mockScan,
      vulnerabilities: [
        {
          packageName: 'mock-package-one',
          severity: 'CRITICAL',
        },
      ],
    });

    await showcasedWebPagesRepo.save({
      webPage: mockPage,
      order: 0,
    });

    const showcaseResponse = await api
      .get('/client/getShowcase')
      .set('Origin', 'http://localhost:3000')
      .expect(200);

    expect(showcaseResponse.body).toMatchObject({
      result: {
        data: {
          showcasedScans: [
            {
              hostname: {
                hostname: mockHostname,
              },
              webPage: {
                path: mockWebPagePath,
              },
              scanPreview: {
                packageNames: [
                  'mock-package-one',
                  'mock-package-two',
                  'mock-package-three',
                  'mock-package-four',
                  'mock-package-five',
                ],
                totalCount: 7,
              },
            },
          ],
          scansWithVulnerabilities: [
            {
              hostname: {
                hostname: mockHostname,
              },
              webPage: {
                path: mockWebPagePath,
              },
              vulnerabilities: [
                {
                  packageName: 'mock-package-one',
                  severity: 'CRITICAL',
                },
              ],
            },
          ],
        },
      },
    });
  });

  it('should return correct package showcase dataset', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const mockHostname = 'test-mock.example.com';
    const mockWebPagePath = '/testpage';
    const mockPackageName = 'mock-showcased-package';

    const packageMetadataRepo = em.getRepository(PackageMetadata);
    const scanRepo = em.getRepository(WebPageScan);
    const packageUsageRepo = em.getRepository(PackageUsageByHostnameProjection);
    const showcasedPackageRepo = em.getRepository(ShowcasedPackage);

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

    await showcasedPackageRepo.save({
      packageName: mockPackageName,
    });

    const showcaseResponse = await api.get('/client/getShowcase').expect(200);

    expect(showcaseResponse.body).toMatchObject({
      result: {
        data: {
          showcasedScans: [],
          scansWithVulnerabilities: [],
          showcasedPackages: [
            {
              name: 'mock-showcased-package',
              description: 'mock showcased package description',
              usageByHostnameCount: 1,
              usage: [{ hostname: mockHostname, packageName: 'mock-showcased-package' }],
            },
          ],
        },
      },
    });
  });
});
