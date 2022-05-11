import { createSupertestApi } from '@gradejs-public/shared';
import { createWorker } from './app';
import { pollNpmRegistryUpdates } from './tasks';

const api = createSupertestApi(createWorker);

jest.mock('./tasks', () => ({
  pollNpmRegistryUpdates: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe('worker / app', () => {
  it('healthcheck endpoint', async () => {
    const response = await api.get('/').send().expect(200);
    expect(response.text).toEqual('gradejs-public-worker');
  });

  it('should handle unknown tasks', async () => {
    await api.post('/').send({ type: 'unknownABC' }).expect(500);
  });

  it('should execute task pollNpmRegistryUpdates', async () => {
    const payload = Math.random();

    const response = await api
      .post('/')
      .send({ type: 'pollNpmRegistryUpdates', payload })
      .expect(200);

    expect(pollNpmRegistryUpdates).toHaveBeenCalledTimes(1);
    expect(pollNpmRegistryUpdates).toHaveBeenCalledWith(payload);
    expect(response.body).toMatchObject({ ok: true });
  });
});
