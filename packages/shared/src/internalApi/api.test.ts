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
    const response = {
      data: {
        id: 1,
        url,
        status: 'in-progress',
        packages: [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    };

    fetchMode.mockImplementation(() => Promise.resolve(new Response(JSON.stringify(response))));

    const result = await requestWebPageScan(url, '1');

    expect(fetchMode).toBeCalledWith('https://mocked-domain.com/webpage/scan', {
      method: 'POST',
      body: `{"url":"${url}"}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(fetchMode).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(response.data);
  });
});
