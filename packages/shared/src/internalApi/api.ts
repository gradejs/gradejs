import fetch, { RequestInit } from 'node-fetch';
import { getInternalApiOrigin } from '../utils/env';

export type DetectedPackage = {
  name: string;
  possibleVersions: string[];
  versionRange: string;
  approximateSize: number | null;
};

export interface Website {
  id: number;
  url: string;
  status: WebsiteStatus;
  detectedPackages: DetectedPackage[];
  updatedAt: string;
  createdAt: string;
}

export enum WebsiteStatus {
  Created = 'created',
  InProgress = 'in-progress',
  Ready = 'ready',
  Failed = 'failed',
  Invalid = 'invalid',
  Protected = 'protected',
}

export interface Package {
  name: string;
  latestVersion: string;
}

export interface PackageIndexRequest {
  name: string;
  versions: string[];
  [key: string]: unknown;
}

type Paginaton = {
  offset: number;
  limit: number;
  total: number;
};

export async function initiateUrlProcessing(url: string) {
  return fetchEndpoint<Website>('POST', '/website/parse', { url });
}

export async function fetchUrlPackages(url: string) {
  return fetchEndpoint<Website>('GET', '/website', { url });
}

export async function fetchPackageIndex(offset = 0, limit = 0) {
  return fetchEndpoint<{ pagination: Paginaton; packages: Package[] }>('GET', '/package/index', {
    offset,
    limit,
  });
}

export async function requestPackageIndexing(payload: PackageIndexRequest) {
  return fetchEndpoint<boolean>('PATCH', '/package/index', payload);
}

export async function fetchEndpoint<T>(
  method: 'GET' | 'POST' | 'PATCH',
  endpoint: string,
  data?: Record<string, unknown>
) {
  const requestUrl = new URL(endpoint, getInternalApiOrigin());
  const requestInit: RequestInit = { method };

  if (method === 'POST' || method === 'PATCH') {
    requestInit.headers = { 'Content-Type': 'application/json' };
    requestInit.body = JSON.stringify(data);
  } else if (method === 'GET' && data) {
    for (const key of Object.keys(data)) {
      requestUrl.searchParams.append(key, `${data[key]}`);
    }
  }

  // console.log('Request to internal API: ', requestUrl.toString(), requestInit);

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
