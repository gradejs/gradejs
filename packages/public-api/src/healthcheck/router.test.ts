import { createSupertestApi } from '@gradejs-public/test-utils';
import { createApp } from '../app';

const api = createSupertestApi(createApp);

describe('GET /', () => {
  it('should check origin', async () => {
    await api.get('/').set('Origin', 'http://invalid').send().expect(400);
  });

  it('should return valid response', async () => {
    await api.get('/').set('Origin', 'http://test').send().expect(200);
  });

  it('should return not found error', async () => {
    const response = await api
      .get('/any-invalid-route')
      .set('Origin', 'http://test')
      .send()
      .expect(404);

    expect(response.body).toMatchObject({
      error: {
        code: 404,
        message: 'Not Found',
      },
    });
  });
});
