import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import { findOrCreateWebPage, syncWebPageScanResult } from './service';
import { getDatabaseConnection, systemApi, WebPageScan } from '@gradejs-public/shared';

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
      requestId: scan.id.toString(),
      status: systemApi.ScanReport.Status.Ready,
      url: url.toString(),
      sourcePageMetadata: {},
      identifiedModuleMap: {
        moduleId: {
          packageName: 'react',
          packageVersionSet: ['17.0.0'],
          packageFile: 'index.js',
          approximateByteSize: 100,
        },
      },
      identifiedPackages: [
        {
          name: 'react',
          versionSet: ['17.0.0'],
          moduleIds: ['moduleId'],
        },
      ],
      identifiedBundler: { name: '', versionRange: '' },
      processedScripts: [],
    });

    const updatedScan = await em.getRepository(WebPageScan).findOneOrFail({ id: scan.id });
    expect(updatedScan).toMatchObject({
      status: WebPageScan.Status.Processed,
      scanResult: {
        identifiedModuleMap: {
          moduleId: {
            packageName: 'react',
            packageVersionSet: ['17.0.0'],
            packageFile: 'index.js',
            approximateByteSize: 100,
          },
        },
        identifiedPackages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            moduleIds: ['moduleId'],
          },
        ],
      },
    });
    expect(updatedScan.finishedAt?.getTime()).toBeGreaterThan(updatedScan.createdAt.getTime());
  });

  it('should persist new scan result', async () => {
    const url = new URL('https://example.com/test2');

    const scan = await syncWebPageScanResult({
      status: systemApi.ScanReport.Status.Ready,
      url: url.toString(),
      identifiedModuleMap: {},
      sourcePageMetadata: {},
      identifiedPackages: [
        {
          name: 'react',
          versionSet: ['17.0.0'],
          moduleIds: [],
        },
      ],
      identifiedBundler: { name: '', versionRange: '' },
      processedScripts: [],
    });

    expect(scan).toMatchObject({
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
  });

  it('should throw upon syncing non-existing scan', async () => {
    const url = new URL('https://example.com/test3');

    const syncPromise = syncWebPageScanResult({
      requestId: '9999999',
      status: systemApi.ScanReport.Status.Ready,
      url: url.toString(),
      identifiedModuleMap: {},
      sourcePageMetadata: {},
      identifiedPackages: [
        {
          name: 'react',
          versionSet: ['17.0.0'],
          moduleIds: [],
        },
      ],
      identifiedBundler: { name: '', versionRange: '' },
      processedScripts: [],
    });

    await expect(syncPromise).rejects.toThrow();
  });
});
