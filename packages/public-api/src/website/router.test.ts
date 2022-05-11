import {
  createSupertestApi,
  useDatabaseConnection,
  useTransactionalTesting,
  Internal,
  internalApi,
  WebPage,
  WebPagePackage,
} from '@gradejs-public/shared';
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
      } as Internal.Website)
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
      package: 'react@17.0.2',
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
        url,
        status: 'ready',
        packages: ['react@17.0.2', 'object-assing@4.1.1'],
      } as Internal.Website)
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
            package: 'react@17.0.2',
          },
          {
            latestUrl: url,
            hostname,
            package: 'object-assing@4.1.1',
          },
        ],
      },
    });
  });
});
