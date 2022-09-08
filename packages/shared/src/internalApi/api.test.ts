import fetch from 'node-fetch';
import { requestWebPageScan } from './api';

jest.mock('node-fetch');
process.env.INTERNAL_API_ORIGIN = 'https://mocked-domain.com/';

const fetchMode = fetch as any as jest.Mock;
const { Response } = jest.requireActual('node-fetch');

beforeEach(() => {
  fetchMode.mockClear();
});

describe('internalApi', () => {
  it('initiateUrlProcessingInternal', async () => {
    const url = 'http://example.com/' + Math.random().toString();
    const requestId = 'test-req-id';

    fetchMode.mockImplementation(() => Promise.resolve(new Response('', { status: 204 })));

    const result = await requestWebPageScan(url, requestId);

    expect(fetchMode).toBeCalledWith('https://api.gradejs.com/website/scan', {
      method: 'POST',
      body: `{"url":"${url}","requestId":"${requestId}"}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': 'TEST_API_KEY',
      },
    });

    expect(fetchMode).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({});
  });
});
