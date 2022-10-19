import fetch from 'node-fetch';
import { requestWebPageScan } from './api';

jest.mock('node-fetch');
process.env.INTERNAL_API_ORIGIN = 'https://mocked-domain.com/';

const fetchMock = fetch as any as jest.Mock;
const { Response } = jest.requireActual('node-fetch');

beforeEach(() => {
  fetchMock.mockClear();
});

describe('systemApi', () => {
  it('initiateUrlProcessingInternal', async () => {
    const url = 'http://example.com/' + Math.random().toString();
    const requestId = 'test-req-id';

    fetchMock.mockImplementation(async () => new Response('', { status: 204 }));

    const result = await requestWebPageScan(url, requestId);

    expect(fetchMock).toBeCalledWith('https://api.test.gradejs.com/website/scan', {
      method: 'POST',
      body: `{"url":"${url}","requestId":"${requestId}"}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'TEST_API_KEY',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({});
  });
});
