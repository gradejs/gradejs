import { getRepository } from 'typeorm';
import { syncPackageIndexBatch } from './syncPackageIndexBatch';
import * as npmRegistry from '../npmRegistry/api';
import { systemApi, PackageMetadata } from '@gradejs-public/shared';
import { useDatabaseConnection, useTransactionalTesting } from '@gradejs-public/test-utils';

useDatabaseConnection();
useTransactionalTesting();

describe('task / syncPackageIndexBatch', () => {
  it('should index new versions', async () => {
    const mockedPackage = {
      name: 'any-fake-package',
      latestVersion: '1.0.0',
    };

    const updatedAt = new Date();

    const npmApisFetchMock = jest
      .spyOn(npmRegistry, 'fetchPackageStatsAndMetadata')
      .mockImplementation(() =>
        Promise.resolve({
          updateSeq: 123,
          updatedAt,
          versionSpecificValues: { '0.1.0': {}, '1.0.0': {}, '1.0.1': {}, '1.1.0': {} },
          latestVersion: '1.1.0',
          downloads: 500,
        } as any)
      );

    const requestPackageIndexingMock = jest
      .spyOn(systemApi, 'requestPackageIndexing')
      .mockImplementation(() => Promise.resolve(true));

    await syncPackageIndexBatch([mockedPackage]);

    expect(npmApisFetchMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledWith({
      name: 'any-fake-package',
      versions: ['0.1.0', '1.0.0', '1.0.1', '1.1.0'],
    });

    const savedPackage = await getRepository(PackageMetadata).findOne({ name: mockedPackage.name });

    expect(savedPackage).toMatchObject({
      latestVersion: '1.1.0',
      updateSeq: 123,
      updatedAt,
    });
  });

  it('should upsert packages', async () => {
    const savedPackage = await getRepository(PackageMetadata).save({
      name: 'any-saved-package',
      latestVersion: '1.0.0',
      updateSeq: 12,
      updatedAt: new Date(),
    });

    const npmApisFetchMock = jest
      .spyOn(npmRegistry, 'fetchPackageStatsAndMetadata')
      .mockImplementation(() =>
        Promise.resolve({
          updateSeq: savedPackage.updateSeq,
          updatedAt: savedPackage.updatedAt,
          versionSpecificValues: { '0.1.0': {}, '1.0.0': {} },
          latestVersion: savedPackage.latestVersion,
          downloads: 100,
        } as any)
      );

    const requestPackageIndexingMock = jest.spyOn(systemApi, 'requestPackageIndexing');

    await syncPackageIndexBatch([
      { name: savedPackage.name, latestVersion: savedPackage.latestVersion },
    ]);

    expect(npmApisFetchMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledTimes(1);

    const updatedPackage = await getRepository(PackageMetadata).findOne({
      name: savedPackage.name,
    });

    expect(updatedPackage).toMatchObject(savedPackage);
  });
});
