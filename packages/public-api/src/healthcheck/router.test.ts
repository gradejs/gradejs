import { createSupertestApi } from '../utils/testUtils';

const api = createSupertestApi();

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
