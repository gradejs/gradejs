import { getRepository } from 'typeorm';
import { syncPackageIndexBatch } from './syncPackageIndexBatch';
import * as npmRegistry from '../npmRegistry/api';
import {
  internalApi,
  PackageMetadata,
  useDatabaseConnection,
  useTransactionalTesting,
} from '@gradejs-public/shared';

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
          versionList: ['0.1.0', '1.0.0', '1.0.1', '1.1.0'],
          latestVersion: '1.1.0',
          downloads: 500,
        } as any)
      );

    const requestPackageIndexingMock = jest
      .spyOn(internalApi, 'requestPackageIndexing')
      .mockImplementation(() => Promise.resolve(true));

    await syncPackageIndexBatch([mockedPackage]);

    expect(npmApisFetchMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledWith([
      'any-fake-package@1.0.1',
      'any-fake-package@1.1.0',
    ]);

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
          versionList: ['0.1.0', '1.0.0'],
          latestVersion: savedPackage.latestVersion,
          downloads: 100,
        } as any)
      );

    const requestPackageIndexingMock = jest.spyOn(internalApi, 'requestPackageIndexing');

    await syncPackageIndexBatch([
      { name: savedPackage.name, latestVersion: savedPackage.latestVersion },
    ]);

    expect(npmApisFetchMock).toHaveBeenCalledTimes(1);
    expect(requestPackageIndexingMock).toHaveBeenCalledTimes(0);

    const updatedPackage = await getRepository(PackageMetadata).findOne({
      name: savedPackage.name,
    });

    expect(savedPackage).toMatchObject(updatedPackage as any);
  });
});
