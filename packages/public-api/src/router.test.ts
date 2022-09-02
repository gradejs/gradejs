import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import {
  internalApi,
  PackageMetadata,
  PackageVulnerability,
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

useDatabaseConnection();
useTransactionalTesting();

const api = createSupertestApi(createApp);

describe('routes / heathCheck', () => {
  it('should return valid response for healthcheck path', async () => {
    await api.get('/').send().expect(200);
  });

  it('should return not found error', async () => {
    const response = await api
      .get('/any-invalid-route')
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
  it('should initiate webpage parsing', async () => {
    const siteUrl = 'https://example.com/' + Math.random().toString();

    const initiateUrlProcessingInternalMock = jest.spyOn(internalApi, 'initiateUrlProcessing');

    initiateUrlProcessingInternalMock.mockImplementation((url) =>
      Promise.resolve({
        url,
        status: 'in-progress',
      } as internalApi.Website)
    );

    const response = await api
      .post('/requestParseWebsite')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify(siteUrl))
      .expect(200);
    const webpage = await getRepository(WebPage).findOne({ url: siteUrl });

    expect(initiateUrlProcessingInternalMock).toHaveBeenCalledTimes(1);
    expect(initiateUrlProcessingInternalMock).toHaveBeenCalledWith(siteUrl);
    expect(response.body).toMatchObject({
      result: {
        data: {
          id: expect.anything(),
          url: siteUrl,
          hostname: 'example.com',
          status: 'pending',
        },
      },
    });

    expect(webpage).toMatchObject({
      url: siteUrl,
      hostname: 'example.com',
      status: 'pending',
    });
  });

  it('should return cached website by a hostname', async () => {
    const hostname = Math.random().toString() + 'example.com';
    const url = `https://${hostname}/`;

    const fetchUrlPackagesMock = jest.spyOn(internalApi, 'fetchUrlPackages');

    // Populate
    const webpageInsert = await getRepository(WebPage).insert({
      url,
      hostname,
      status: WebPage.Status.Processed,
    });

    const packageInsert = await getRepository(WebPageScan).insert({
      latestUrl: url,
      hostname,
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2',
    });

    const packageMetadataInsert = await getRepository(PackageMetadata).insert({
      name: 'react',
      latestVersion: '18.0.0',
      monthlyDownloads: 100,
      updateSeq: 5,
      license: 'MIT',
    });

    await getRepository(PackageVulnerability).insert({
      packageName: 'react',
      packageVersionRange: '>=17.0.0 <18.0.0',
      osvId: 'GRJS-test-id',
      osvData: {
        schema_version: '1.2.0',
        id: 'GRJS-test-id',
        summary: 'Test summary',
        database_specific: {
          severity: 'HIGH',
        },
      },
    });

    const response = await api
      .post('/syncWebsite')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify(hostname))
      .expect(200);

    expect(fetchUrlPackagesMock).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
      result: {
        data: {
          webpages: webpageInsert.generatedMaps,
          packages: [
            {
              ...packageInsert.generatedMaps[0],
              registryMetadata: packageMetadataInsert.generatedMaps[0],
            },
          ],
          vulnerabilities: {
            react: [
              {
                affectedPackageName: 'react',
                affectedVersionRange: '>=17.0.0 <18.0.0',
                osvId: 'GRJS-test-id',
                detailsUrl: `https://github.com/advisories/GRJS-test-id`,
                summary: 'Test summary',
                severity: 'HIGH',
              },
            ],
          },
        },
      },
    });
  });

  it('should sync pending webpages', async () => {
    const hostname = Math.random().toString() + 'example.com';
    const siteUrl = `https://${hostname}/`;

    // Populate
    const webpageInsert = await getRepository(WebPage).insert({
      url: siteUrl,
      hostname,
      status: WebPage.Status.Pending,
    });

    const fetchUrlPackagesMock = jest.spyOn(internalApi, 'fetchUrlPackages');

    fetchUrlPackagesMock.mockImplementation((url) =>
      Promise.resolve({
        id: 0,
        updatedAt: '1',
        createdAt: '1',
        url,
        status: 'ready',
        detectedPackages: [
          {
            name: 'react',
            versionRange: '17.0.2',
            possibleVersions: ['17.0.2'],
            approximateSize: 1337,
          },
          {
            name: 'object-assign',
            versionRange: '4.1.0 - 4.1.1',
            possibleVersions: ['4.1.0', '4.1.1'],
            approximateSize: 42,
          },
        ],
      } as internalApi.Website)
    );

    const response = await api
      .post('/syncWebsite')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify(hostname))
      .expect(200);
    expect(fetchUrlPackagesMock).toHaveBeenCalledTimes(1);
    expect(fetchUrlPackagesMock).toHaveBeenCalledWith(siteUrl);

    expect(response.body).toMatchObject({
      result: {
        data: {
          webpages: [
            {
              ...webpageInsert.generatedMaps.at(0),
              status: WebPage.Status.Processed,
              updatedAt: expect.anything(),
            },
          ],
          packages: [
            {
              latestUrl: siteUrl,
              hostname,
              packageName: 'react',
              possiblePackageVersions: ['17.0.2'],
              packageVersionRange: '17.0.2',
              packageMetadata: {
                approximateByteSize: 1337,
              },
            },
            {
              latestUrl: siteUrl,
              hostname,
              packageName: 'object-assign',
              possiblePackageVersions: ['4.1.0', '4.1.1'],
              packageVersionRange: '4.1.0 - 4.1.1',
              packageMetadata: {
                approximateByteSize: 42,
              },
            },
          ],
          vulnerabilities: {},
        },
      },
    });
  });
});
