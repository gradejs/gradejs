import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import {
  getDatabaseConnection,
  PackageUsageByHostnameProjection,
  WebPageScan,
} from '@gradejs-public/shared';
import { findOrCreateWebPage } from '../website/service';
import { syncPackageUsageByHostname } from './syncPackageUsageByHostname';

useDatabaseConnection();
useTransactionalTesting();

describe('projections / packageUsageByHostname', () => {
  it('should sync reported scans', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const url = new URL('https://example.com/test');

    const webPage = await findOrCreateWebPage(url, em);

    const scan = await em.getRepository(WebPageScan).save({
      webPage,
      status: WebPageScan.Status.Processed,
      scanResult: {
        identifiedPackages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            moduleIds: [],
          },
        ],
      },
    });

    await syncPackageUsageByHostname(scan, em);

    const packageUsageByHostEntries = await em
      .getRepository(PackageUsageByHostnameProjection)
      .find({
        packageName: 'react',
      });

    expect(packageUsageByHostEntries).toMatchObject([
      {
        sourceScanId: scan.id,
        hostnameId: scan.webPage.hostnameId,
        packageName: 'react',
        packageVersionSet: ['17.0.0'],
      },
    ]);
  });

  it('should clean up changed packages between scans', async () => {
    const db = await getDatabaseConnection();
    const em = db.createEntityManager();

    const url = new URL('https://example.com/test');

    const webPage = await findOrCreateWebPage(url, em);

    const firstScan = await em.getRepository(WebPageScan).save({
      webPage,
      status: WebPageScan.Status.Processed,
      scanResult: {
        identifiedPackages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            moduleIds: [],
          },
          {
            name: 'react-dom',
            versionSet: ['17.0.0'],
            versionRange: '17.0.0',
          },
        ],
      },
    });

    await syncPackageUsageByHostname(firstScan, em);

    const packageUsageByHostEntries = await em
      .getRepository(PackageUsageByHostnameProjection)
      .createQueryBuilder('usage')
      .where('usage.hostname_id = :hostnameId', { hostnameId: firstScan.webPage.hostnameId })
      .getMany();

    expect(packageUsageByHostEntries).toMatchObject([
      {
        sourceScanId: firstScan.id,
        hostnameId: firstScan.webPage.hostnameId,
        packageName: 'react',
        packageVersionSet: ['17.0.0'],
      },
      {
        sourceScanId: firstScan.id,
        hostnameId: firstScan.webPage.hostnameId,
        packageName: 'react-dom',
        packageVersionSet: ['17.0.0'],
      },
    ]);

    const secondScan = await em.getRepository(WebPageScan).save({
      webPage,
      status: WebPageScan.Status.Processed,
      scanResult: {
        identifiedPackages: [
          {
            name: 'react',
            versionSet: ['17.0.0'],
            moduleIds: [],
          },
        ],
      },
    });

    await syncPackageUsageByHostname(secondScan, em);

    const secondPackageUsageByHostEntries = await em
      .getRepository(PackageUsageByHostnameProjection)
      .createQueryBuilder('usage')
      .where('usage.hostname_id = :hostnameId', { hostnameId: firstScan.webPage.hostnameId })
      .getMany();

    expect(secondPackageUsageByHostEntries).toMatchObject([
      {
        sourceScanId: secondScan.id,
        hostnameId: firstScan.webPage.hostnameId,
        packageName: 'react',
        packageVersionSet: ['17.0.0'],
      },
    ]);
  });
});
