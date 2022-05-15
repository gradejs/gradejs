import fetch, { RequestInit } from 'node-fetch';
import { getInternalApiOrigin } from '../utils/env';
import { Internal } from './types';

type Paginaton = {
  offset: number;
  limit: number;
  total: number;
};

export async function initiateUrlProcessing(url: string) {
  return fetchEndpoint<Internal.Website>('POST', '/website/parse', { url });
}

export async function fetchUrlPackages(url: string) {
  return fetchEndpoint<Internal.Website>('GET', '/website', { url });
}

export async function fetchPackageIndex(offset = 0, limit = 0) {
  return fetchEndpoint<{ pagination: Paginaton; packages: Internal.Package[] }>(
    'GET',
    '/package/index',
    {
      offset,
      limit,
    }
  );
}

export async function requestPackageIndexing(packagesToIndex: string[]) {
  return fetchEndpoint<boolean>('POST', '/package/index', {
    packages: packagesToIndex,
  });
}

export async function fetchEndpoint<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  data?: Record<string, unknown>
) {
  const requestUrl = new URL(endpoint, getInternalApiOrigin());
  const requestInit: RequestInit = { method };

  if (method === 'POST') {
    requestInit.headers = { 'Content-Type': 'application/json' };
    requestInit.body = JSON.stringify(data);
  } else if (method === 'GET' && data) {
    for (const key of Object.keys(data)) {
      requestUrl.searchParams.append(key, `${data[key]}`);
    }
  }

  return fetch(requestUrl.toString(), requestInit)
    .then((response) => response.json())
    .then((json: any) => {
      if (!json.data) {
        throw new Error('Invalid response format');
      }

      return json.data as T;
    })
    .catch((error: Error) => {
      throw new Error(`Invalid Internal API Response: ${error.message}`);
    });
}
