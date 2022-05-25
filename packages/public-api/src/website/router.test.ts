import { internalApi, WebPage, WebPagePackage } from '@gradejs-public/shared';
import {
  createSupertestApi,
  useDatabaseConnection,
  useTransactionalTesting,
} from '@gradejs-public/test-utils';
import { getRepository } from 'typeorm';
import { createApp } from '../app';

useDatabaseConnection();
useTransactionalTesting();

const api = createSupertestApi(createApp);

describe('routes / website', () => {
  it('should initiate webpage parsing', async () => {
    const url = 'https://example.com/' + Math.random();

    const initiateUrlProcessingInternalMock = jest.spyOn(internalApi, 'initiateUrlProcessing');

    initiateUrlProcessingInternalMock.mockImplementation((url) =>
      Promise.resolve({
        url,
        status: 'in-progress',
      } as internalApi.Website)
    );

    const response = await api.post('/webpage').send({ url }).expect(200);
    const webpage = await getRepository(WebPage).findOne({ url });

    expect(initiateUrlProcessingInternalMock).toHaveBeenCalledTimes(1);
    expect(initiateUrlProcessingInternalMock).toHaveBeenCalledWith(url);
    expect(response.body).toMatchObject({
      data: {
        id: expect.anything(),
        url,
        hostname: 'example.com',
        status: 'pending',
      },
    });

    expect(webpage).toMatchObject({
      url,
      hostname: 'example.com',
      status: 'pending',
    });
  });

  it('should return cached website by a hostname', async () => {
    const hostname = Math.random() + 'example.com';
    const url = `https://${hostname}/`;

    const fetchUrlPackagesMock = jest.spyOn(internalApi, 'fetchUrlPackages');

    // Populate
    const webpageInsert = await getRepository(WebPage).insert({
      url,
      hostname,
      status: WebPage.Status.Processed,
    });

    const packageInsert = await getRepository(WebPagePackage).insert({
      latestUrl: url,
      hostname,
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2',
    });

    const response = await api.get(`/website/${hostname}`).expect(200);

    expect(fetchUrlPackagesMock).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
      data: {
        webpages: webpageInsert.generatedMaps,
        packages: packageInsert.generatedMaps,
      },
    });
  });

  it('should sync pending webpages', async () => {
    const hostname = Math.random() + 'example.com';
    const url = `https://${hostname}/`;

    // Populate
    const webpageInsert = await getRepository(WebPage).insert({
      url,
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

    const response = await api.get(`/website/${hostname}`).expect(200);
    expect(fetchUrlPackagesMock).toHaveBeenCalledTimes(1);
    expect(fetchUrlPackagesMock).toHaveBeenCalledWith(url);

    expect(response.body).toMatchObject({
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
            latestUrl: url,
            hostname,
            packageName: 'react',
            possiblePackageVersions: ['17.0.2'],
            packageVersionRange: '17.0.2',
            packageMetadata: {
              approximateByteSize: 1337,
            },
          },
          {
            latestUrl: url,
            hostname,
            packageName: 'object-assign',
            possiblePackageVersions: ['4.1.0', '4.1.1'],
            packageVersionRange: '4.1.0 - 4.1.1',
            packageMetadata: {
              approximateByteSize: 42,
            },
          },
        ],
      },
    });
  });
});
