import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import {
  getDatabaseConnection,
  PackageVulnerability,
  ScansWithVulnerabilitiesProjection,
  WebPageScan,
} from '@gradejs-public/shared';
import { findOrCreateWebPage } from '../website/service';
import { syncScansWithVulnerabilities } from './syncScansWithVulnerabilities';

useDatabaseConnection();
useTransactionalTesting();

describe('projections / scansWithVulnerabilities', () => {
  it('should sync reported scans with vulnerabilities', async () => {
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

    await em.getRepository(PackageVulnerability).save({
      packageName: 'react',
      packageVersionRange: '<=17.0.0',
      osvId: 'test-osv-id',
      osvData: {
        schema_version: '',
        modified: '',
        id: 'test-osv-id',
        severity: [
          {
            type: 'CVSS_V3',
            score: 'SEVERE',
          },
        ],
        database_specific: {
          severity: 'SEVERE',
        },
      },
    });

    await syncScansWithVulnerabilities(scan, em);

    const scanWithVulnerabilities = await em
      .getRepository(ScansWithVulnerabilitiesProjection)
      .createQueryBuilder('scans')
      .where('scans.source_scan_id = :scanId', { scanId: scan.id })
      .getOne();

    expect(scanWithVulnerabilities).toMatchObject({
      vulnerabilities: [
        {
          packageName: 'react',
          severity: 'SEVERE',
        },
      ],
    });
  });
});
