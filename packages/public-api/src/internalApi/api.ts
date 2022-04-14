import fetch, { RequestInit } from 'node-fetch';
import { getInternalApiOrigin } from '../utils/env';
import { WebsiteInternal } from './types';

export async function initiateUrlProcessingInternal(url: string) {
  return fetchInternal<WebsiteInternal>('POST', '/website/parse', { url });
}

export async function fetchUrlPackages(url: string) {
  return fetchInternal<WebsiteInternal>('GET', '/website', { url });
}

export async function fetchInternal<T>(
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
