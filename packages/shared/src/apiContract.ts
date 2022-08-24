import { PackageVulnerabilityData } from './database/entities/packageVulnerability';
import { WebPage } from './database/entities/webPage';
import { WebPagePackage } from './database/entities/webPagePackage';

/**
 * We use single api typings for both frontend and backend packages
 */
export type RouteMap = {
  '/': {
    GET: {
      response: string;
    };
  };
  '/website/:hostname': {
    GET: {
      params: {
        hostname: string;
      };
      response: {
        webpages: WebPage[];
        packages: WebPagePackage[];
        vulnerabilities: Record<string, PackageVulnerabilityData[]>;
      };
    };
  };
  '/webpage': {
    POST: {
      body: {
        url: string;
      };
      response: WebPage;
    };
  };
};

export type Routes = keyof RouteMap;
export type GetRoutes = PickRoutesByMethod<'GET'>;
export type PostRoutes = PickRoutesByMethod<'POST'>;

export type RequestOptions = {
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
};

/**
 * Server entities
 */
export { WebPage, WebPagePackage, PackageVulnerabilityData };

/** Generics */

export type Response<TData = undefined> = { data: TData } | { error: Error };

export type Error = {
  code: number;
  message?: string;
  param?: string;
  type?: string;
};

type PickRoutesByMethod<Method> = {
  [Route in Routes]: keyof RouteMap[Route] extends Method ? Route : never;
}[Routes];
