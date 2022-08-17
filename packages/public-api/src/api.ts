import { WebPage, WebPagePackage } from '@gradejs-public/shared';
import { Router, Request, Response, NextFunction } from 'express';
import { ApiPackageVulnerabilityData } from './vulnerabilities/vulnerabilities';

type RouteDefinition = {
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

type Routes = keyof RouteDefinition;
type GetRoutes = PickRoutesByMethod<'GET'>;
type PostRoutes = PickRoutesByMethod<'POST'>;

type PickRoutesByMethod<Method> = {
  [Route in Routes]: keyof RouteDefinition[Route] extends Method ? Route : never;
}[Routes];

type RouteProperty<Route extends Routes, Method extends keyof RouteDefinition[Route], PropName> =
  PropName extends keyof RouteDefinition[Route][Method]
    ? RouteDefinition[Route][Method][PropName]
    : never;

type RouteRequest<Route extends Routes, Method> = Method extends keyof RouteDefinition[Route]
  ? Request<
      RouteProperty<Route, Method, 'path'>,
      unknown,
      RouteProperty<Route, Method, 'body'>,
      RouteProperty<Route, Method, 'query'>
    >
  : Request;

type RouteHandler<Route extends Routes, Method> = Method extends keyof RouteDefinition[Route]
  ? (req: RouteRequest<Route, Method>) => Promise<RouteProperty<Route, Method, 'response'>>
  : never;

export class TypedRouter {
  expressRouter: Router;

  constructor() {
    this.expressRouter = Router();
  }

  get<Route extends GetRoutes>(route: Route, handler: RouteHandler<Route, 'GET'>) {
    this.handle('GET', route, handler);
  }

  post<Route extends PostRoutes>(route: Route, handler: RouteHandler<Route, 'POST'>) {
    this.handle('POST', route, handler);
  }

  handle<Route extends Routes, Method extends keyof RouteDefinition[Route]>(
    method: Method,
    route: Route,
    handler: RouteHandler<Route, Method>
  ) {
    const expressHandler = async (req: any, res: Response, next: NextFunction) => {
      try {
        const response = await handler(req);
        res.json(response);
      } catch (e) {
        next(e);
      }
    };

    switch (method.toString()) {
      case 'GET':
        this.expressRouter.get(route, expressHandler);
        break;

      case 'POST':
        this.expressRouter.post(route, expressHandler);
        break;
    }
  }
}
