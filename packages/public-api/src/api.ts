import { WebPage, WebPagePackage } from '@gradejs-public/shared';
import { ApiPackageVulnerabilityData } from './vulnerabilities/vulnerabilities';

export type RouteDefinition = {
  '/website/:hostname': {
    GET: {
      path: {
        hostname: string;
      };
      response: {
        webpages: WebPage[];
        packages: WebPagePackage[];
        vulnerabilities: Record<string, ApiPackageVulnerabilityData[]>;
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

export type CommonRequestOptions = {
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
};

export type Routes = keyof RouteDefinition;
export type GetRoutes = PickRoutesByMethod<'GET'>;
export type PostRoutes = PickRoutesByMethod<'POST'>;

// Server entities
export { WebPage, WebPagePackage };

export type RouteProperty<
  Route extends Routes,
  Method extends keyof RouteDefinition[Route],
  PropName
> = PropName extends keyof RouteDefinition[Route][Method]
  ? RouteDefinition[Route][Method][PropName]
  : never;

type PickRoutesByMethod<Method> = {
  [Route in Routes]: keyof RouteDefinition[Route] extends Method ? Route : never;
}[Routes];
