import { createSupertestApi } from '@gradejs-public/test-utils';
import { createWorker } from './app';
import { syncPackageIndex } from './tasks';

const api = createSupertestApi(createWorker);

jest.mock('./tasks', () => ({
  syncPackageIndex: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe('worker / app', () => {
  it('healthcheck endpoint', async () => {
    const response = await api.get('/').send().expect(200);
    expect(response.text).toEqual('gradejs-public-worker');
  });

  it('should handle unknown tasks', async () => {
    await api.post('/').send({ type: 'unknownABC' }).expect(500);
  });

  it('should execute task syncPackageIndex', async () => {
    const payload = Math.random();

    const response = await api.post('/').send({ type: 'syncPackageIndex', payload }).expect(200);

    expect(syncPackageIndex).toHaveBeenCalledTimes(1);
    expect(syncPackageIndex).toHaveBeenCalledWith(payload);
    expect(response.body).toMatchObject({ ok: true });
  });
});
