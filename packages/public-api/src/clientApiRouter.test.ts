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
} from '@gradejs-public/shared';
import {
  createSupertestApi,
  useDatabaseConnection,
  useTransactionalTesting,
} from '@gradejs-public/test-utils';
import { getRepository } from 'typeorm';
import { createApp } from './app';
import { findOrCreateWebPage } from './website/service';

useDatabaseConnection();
useTransactionalTesting();

const api = createSupertestApi(createApp);

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
            identifiedPackages: [
              {
                name: 'react',
                versionSet: ['17.0.0'],
                registryMetadata: {
                  name: 'react',
                  latestVersion: '17.0.1',
                  monthlyDownloads: 9001,
                  description: 'short description',
                  fullDescription: 'full description',
                  maintainers: [],
                  keywords: ['react'],
                  versionSpecificValues: {},
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

  it('should return correct showcase dataset', async () => {
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
          affectedPackageName: 'mock-package-one',
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
                  'mock-package-six',
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
                  affectedPackageName: 'mock-package-one',
                  severity: 'CRITICAL',
                },
              ],
            },
          ],
        },
      },
    });
  });
});
