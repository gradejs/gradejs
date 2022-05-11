import { createSupertestApi } from '@gradejs-public/shared';
import { createApp } from '../app';

const api = createSupertestApi(createApp);

describe('routes / heathCheck', () => {
  it('should return valid response', async () => {
    await api.get('/').send().expect(200);
  });

  it('should return not found error', async () => {
    const response = await api.get('/any-invalid-route').send().expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 404,
        message: 'Not Found',
      },
    });
  });
});
