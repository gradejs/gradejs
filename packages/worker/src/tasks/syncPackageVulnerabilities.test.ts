import path from 'node:path';
import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';
import * as advisoryDb from '../githubAdvisoryDb/advisoryDb';
import * as fs from 'fs';
import { syncPackageVulnerabilities } from './syncPackageVulnerabilities';
import { getRepository } from 'typeorm';
import { PackageVulnerability } from '@gradejs-public/shared';

useDatabaseConnection();
useTransactionalTesting();

describe('task / syncPackageVulnerabilities', () => {
  it('should correctly process github advisory db snapshot updates', async () => {
    const fetchAdvisoryDbSnapshotMock = jest
      .spyOn(advisoryDb, 'fetchAdvisoryDbSnapshot')
      .mockImplementationOnce(async () =>
        fs.createReadStream(path.join(__dirname, './.mocks/advisory-database-mock.tar.gz'))
      )
      .mockImplementationOnce(async () =>
        fs.createReadStream(path.join(__dirname, './.mocks/advisory-database-update-mock.tar.gz'))
      );

    await syncPackageVulnerabilities();
    expect(fetchAdvisoryDbSnapshotMock).toBeCalledTimes(1);

    const syncedVulnerabilities = await getRepository(PackageVulnerability).find({
      where: [{ osvId: 'GHSA-273r-mgr4-v34f' }, { osvId: 'GHSA-6h5x-7c5m-7cr7' }],
    });
    expect(syncedVulnerabilities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          osvId: 'GHSA-273r-mgr4-v34f',
          packageName: 'engine.io',
          packageVersionRange: '>=4.0.0 <4.1.2, >=5.0.0 <5.2.1, >=6.0.0 <6.1.1',
        }),
        expect.objectContaining({
          osvId: 'GHSA-6h5x-7c5m-7cr7',
          packageName: 'eventsource',
          packageVersionRange: '>=0 <2.0.2',
        }),
      ])
    );

    await syncPackageVulnerabilities();
    expect(fetchAdvisoryDbSnapshotMock).toBeCalledTimes(2);

    const updatedSyncedVulnerabilities = await getRepository(PackageVulnerability).find({
      where: [{ osvId: 'GHSA-273r-mgr4-v34f' }, { osvId: 'GHSA-6h5x-7c5m-7cr7' }],
    });
    expect(updatedSyncedVulnerabilities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          osvId: 'GHSA-273r-mgr4-v34f',
          packageName: 'engine.io',
          packageVersionRange: '>=4.0.0 <4.1.2, >=5.0.0 <5.2.1',
        }),
        expect.objectContaining({
          osvId: 'GHSA-6h5x-7c5m-7cr7',
          packageName: 'eventsource',
          packageVersionRange: '>=0 <2.0.2',
        }),
      ])
    );
  });
});
