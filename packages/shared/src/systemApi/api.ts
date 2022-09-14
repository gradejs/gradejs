import fetch, { RequestInit } from 'node-fetch';
import { getGradeJsApiKey, getInternalApiRootUrl } from '../utils/env';
import { PackageIndexRequest, PackageRequest, PaginatonRequest } from './types';

export async function requestWebPageScan(url: string, requestId: string) {
  return fetchEndpoint<{}>('POST', '/website/scan', { url, requestId });
}

export async function fetchPackageIndex(offset = 0, limit = 0) {
  return fetchEndpoint<{ pagination: PaginatonRequest; packages: PackageRequest[] }>(
    'GET',
    '/package/index',
    {
      offset,
      limit,
    }
  );
}

export async function requestPackageIndexing(payload: PackageIndexRequest) {
  return fetchEndpoint<boolean>('PATCH', '/package/index', payload);
}

export async function fetchEndpoint<T>(
  method: 'GET' | 'POST' | 'PATCH',
  endpoint: string,
  data?: Record<string, unknown>
) {
  const requestUrl = new URL(endpoint, getInternalApiRootUrl());
  const requestInit: RequestInit = { method };

  if (method === 'POST' || method === 'PATCH') {
    requestInit.headers = { 'Content-Type': 'application/json', 'X-Api-Key': getGradeJsApiKey() };
    requestInit.body = JSON.stringify(data);
  } else if (method === 'GET' && data) {
    for (const key of Object.keys(data)) {
      requestUrl.searchParams.append(key, `${data[key]}`);
    }
  }

  return fetch(requestUrl.toString(), requestInit)
    .then((response) => {
      if (response.status !== 204) {
        return response.json();
      }

      return { data: {} };
    })
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
