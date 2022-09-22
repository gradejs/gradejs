import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import {
  getDatabaseConnection,
  Hostname,
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
      .post('/client/getOrRequestWebPageRescan')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify(siteUrl))
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

    const response = await api
      .post('/client/getOrRequestWebPageScan')
      .set('Origin', 'http://localhost:3000')
      .send(JSON.stringify(siteUrl))
      .expect(200);

    expect(requestWebPageScanMock).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
      result: {
        data: {
          id: existingScan.id.toString(),
          status: WebPageScan.Status.Processed,
          scanResult: {
            packages: [
              {
                name: 'react',
                versionSet: ['17.0.0'],
                versionRange: '17.0.0',
                approximateByteSize: null,
              },
            ],
          },
        },
      },
    });
  });
});
