import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import { findOrCreateWebPage, syncWebPageScanResult } from './service';
import { getDatabaseConnection, internalApi, WebPageScan } from '@gradejs-public/shared';

useDatabaseConnection();
useTransactionalTesting();

describe('website / service', () => {
  it('should persist expected scan result', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const url = new URL('https://example.com/test');

    const webPage = await findOrCreateWebPage(url, em);

    const scan = await em.getRepository(WebPageScan).save({
      webPage: webPage,
      status: WebPageScan.Status.Pending,
    });

    await syncWebPageScanResult({
      id: scan.id.toString(),
      status: internalApi.WebPageScan.Status.Ready,
      url: url.toString(),
      scan: {
        packages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            versionRange: '17.0.0',
            approximateByteSize: null,
          },
        ],
      },
    });

    const updatedScan = await em.getRepository(WebPageScan).findOneOrFail({ id: scan.id });
    expect(updatedScan).toMatchObject({
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
    });
    expect(updatedScan.finishedAt?.getTime()).toBeGreaterThan(updatedScan.createdAt.getTime());
  });

  it('should persist new scan result', async () => {
    const url = new URL('https://example.com/test2');

    const scan = await syncWebPageScanResult({
      status: internalApi.WebPageScan.Status.Ready,
      url: url.toString(),
      scan: {
        packages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            versionRange: '17.0.0',
            approximateByteSize: null,
          },
        ],
      },
    });

    expect(scan).toMatchObject({
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
    });
  });

  it('should throw upon syncing non-existing scan', async () => {
    const url = new URL('https://example.com/test3');

    const syncPromise = syncWebPageScanResult({
      id: '9999999',
      status: internalApi.WebPageScan.Status.Ready,
      url: url.toString(),
      scan: {
        packages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            versionRange: '17.0.0',
            approximateByteSize: null,
          },
        ],
      },
    });

    await expect(syncPromise).rejects.toThrow();
  });
});
