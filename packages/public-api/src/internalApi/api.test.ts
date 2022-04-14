import fetch from 'node-fetch';
import { initiateUrlProcessingInternal, fetchUrlPackages } from './api';

jest.mock('node-fetch');
process.env.INTERNAL_API_ORIGIN = 'https://mocked-domain.com/';

const fetchMode = fetch as any as jest.Mock;
const { Response } = jest.requireActual('node-fetch');

beforeEach(() => {
  fetchMode.mockClear();
});

describe('internalApi', () => {
  it('initiateUrlProcessingInternal', async () => {
    const url = 'http://example.com/' + Math.random();
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

    const result = await initiateUrlProcessingInternal(url);

    expect(fetchMode).toBeCalledWith('https://mocked-domain.com/website/parse', {
      method: 'POST',
      body: `{"url":"${url}"}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(fetchMode).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(response.data);
  });

  it('fetchUrlPackages', async () => {
    const url = 'http://example.com/parsed';
    const response = {
      data: {
        id: 1,
        url,
        status: 'ready',
        packages: ['react@17.0.2'],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    };

    fetchMode.mockImplementation(() => Promise.resolve(new Response(JSON.stringify(response))));

    const result = await fetchUrlPackages(url);

    expect(fetchMode).toBeCalledWith(
      'https://mocked-domain.com/website?url=http%3A%2F%2Fexample.com%2Fparsed',
      {
        method: 'GET',
      }
    );

    expect(fetchMode).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(response.data);
  });
});
