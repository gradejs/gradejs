import { systemApi } from '@gradejs-public/shared';
import { expectQueuedTasks } from '@gradejs-public/test-utils';
import { syncPackageIndex } from './syncPackageIndex';

jest.mock('@aws-sdk/client-sqs');

describe('task / syncPackageIndex', () => {
  it('should schedule batch tasks', async () => {
    const mockPackages = new Array(75).fill(0).map(() => ({
      name: Math.random().toString(),
      latestVersion: `1.${Math.random().toFixed(1)}`,
    }));

    const fetchPackageIndexMock = jest
      .spyOn(systemApi, 'fetchPackageIndex')
      .mockImplementation((offset = 0, limit = 0) =>
        Promise.resolve({
          pagination: { offset, limit, total: mockPackages.length },
          packages: mockPackages.slice(offset, offset + limit),
        })
      );

    await syncPackageIndex();

    expectQueuedTasks([
      { type: 'syncPackageIndexBatch', payload: mockPackages.slice(0, 50) },
      { type: 'syncPackageIndexBatch', payload: mockPackages.slice(50, 75) },
    ]);

    expect(fetchPackageIndexMock).toHaveBeenCalledTimes(3);
  });
});
