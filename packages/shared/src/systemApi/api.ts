import fetch, { RequestInit } from 'node-fetch';
import { getGradeJsApiKey, getInternalApiRootUrl } from '../utils/env';
import { z } from 'zod';

export const identifiedModuleSchema = z.object({
  packageName: z.string(),
  packageVersionSet: z.array(z.string()),
  packageFile: z.string(),
  approximateByteSize: z.number(),
});

export const identifiedPackageSchema = z.object({
  name: z.string(),
  versionSet: z.array(z.string()),
  moduleIds: z.array(z.string()),
});

// TODO: add processed scripts
// TODO: add identified bundler

export const apiScanReportSchema = z.union([
  z.object({
    requestId: z.optional(z.string()),
    url: z.string().url(),
    status: z.literal('ready'),
    identifiedModuleMap: z.record(identifiedModuleSchema),
    identifiedPackages: z.array(identifiedPackageSchema),
  }),
  z.object({
    requestId: z.optional(z.string()),
    url: z.string().url(),
    status: z.literal('error'),
  }),
]);

export namespace ScanReport {
  export type IdentifiedPackage = z.infer<typeof identifiedPackageSchema>;
  export type IdentifiedModule = z.infer<typeof identifiedModuleSchema>;
  export enum Status {
    Ready = 'ready',
    Error = 'error',
  }
}

export type ScanReport = z.infer<typeof apiScanReportSchema>;

export interface PackageRequest {
  name: string;
  latestVersion: string;
}

export interface PackageIndexRequest {
  name: string;
  versions: string[];
  [key: string]: unknown;
}

export type PaginatonRequest = {
  offset: number;
  limit: number;
  total: number;
};

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