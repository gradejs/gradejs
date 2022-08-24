import type { API } from '../../../shared/src/index';

/**
 * Server Entities
 */
export type WebPage = JsonSerialized<API.WebPage>;
export type WebPagePackage = JsonSerialized<API.WebPagePackage>;
export type PackageVulnerabilityData = JsonSerialized<API.PackageVulnerabilityData>;

/**
 * Client
 */
export const apiClient = {
  get<Route extends API.GetRoutes, Method extends keyof API.RouteMap[Route]>(
    route: Route,
    options: EndpointOptions<Route, Method>
  ) {
    return fetchEndpoint('GET', route, options);
  },
  post<Route extends API.PostRoutes, Method extends keyof API.RouteMap[Route]>(
    route: Route,
    options: EndpointOptions<Route, Method>
  ) {
    return fetchEndpoint('POST', route, options);
  },
};

async function fetchEndpoint<Route extends API.Routes, Method extends keyof API.RouteMap[Route]>(
  method: Method,
  route: Route,
  options: API.RequestOptions
) {
  const url = new URL(route, process.env.API_ORIGIN);
  const requestInit: RequestInit = {
    method: method as string,
    headers: { 'Content-Type': 'application/json' },
  };

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.pathname = url.pathname.replace(`:${key}`, String(value));
    }
  }
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  if (options.body) {
    requestInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(url.toString(), requestInit);
  const body = await response.json();

  if (response.status === 200) {
    return body.data as EndpointResponse<Route, Method>;
  } else {
    throw body.error;
  }
}

export type EndpointResponse<Route extends API.Routes, Method extends keyof API.RouteMap[Route]> =
  Method extends keyof API.RouteMap[Route]
    ? 'response' extends keyof API.RouteMap[Route][Method]
      ? JsonSerialized<API.RouteMap[Route][Method]['response']>
      : never
    : never;

// Some data types in entities may be serialized within JSON
type JsonSerialized<T> = {
  [Key in keyof T as T[Key] extends Function ? never : Key]: T[Key] extends Record<string, unknown>
    ? JsonSerialized<T[Key]>
    : T[Key] extends (infer A)[]
    ? JsonSerialized<A>[]
    : T[Key] extends Date
    ? string
    : T[Key] extends Date | undefined
    ? string | undefined
    : T[Key];
};

type EndpointOptions<Route extends API.Routes, Method extends keyof API.RouteMap[Route]> = Omit<
  API.RouteMap[Route][Method],
  'response'
>;
