import * as API from '@gradejs-public/public-api/src/api';

export const api = {
  get<Route extends API.GetRoutes, Method extends keyof API.RouteDefinition[Route]>(
    route: Route,
    options: RequestOptions<Route, Method>
  ) {
    return fetchEndpoint('GET', route, options);
  },
  post<Route extends API.PostRoutes, Method extends keyof API.RouteDefinition[Route]>(
    route: Route,
    options: RequestOptions<Route, Method>
  ) {
    return fetchEndpoint('POST', route, options);
  },
};

// Examples
const data1 = api.get('/website/:hostname', { path: { hostname: 'test.com' } });
console.log(data1);
const data2 = api.post('/webpage', { body: { url: 'test.com' } });
console.log(data2);

// Entities
export type WebPage = JsonSerialized<API.WebPage>;
export type WebPagePackage = JsonSerialized<API.WebPagePackage>;

async function fetchEndpoint<
  Route extends API.Routes,
  Method extends keyof API.RouteDefinition[Route]
>(method: Method, route: Route, options: API.CommonRequestOptions) {
  const url = new URL(route, process.env.API_ORIGIN);
  const requestInit: RequestInit = { method: method as string };

  if (options.path) {
    for (const [key, value] of Object.entries(options.path)) {
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

  // TODO: handle errors
  return response.json() as Promise<JsonSerialized<API.RouteProperty<Route, Method, 'response'>>>;
}

type RequestOptions<Route extends API.Routes, Method extends keyof API.RouteDefinition[Route]> =
  Omit<API.RouteDefinition[Route][Method], 'response'>;

// Some data types in entities may be serialized within JSON
type JsonSerialized<T> = {
  [Key in keyof T]: T[Key] extends Record<string, unknown>
    ? JsonSerialized<T[Key]>
    : T[Key] extends Date
    ? string
    : T[Key];
};
