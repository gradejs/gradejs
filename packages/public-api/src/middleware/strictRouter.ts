import { Router, Request, Response, NextFunction } from 'express';
import { API } from '@gradejs-public/shared';
import { respond } from './response';

/**
 * Express-like router with strict type guards
 */
export class StrictRouter {
  router: Router;

  constructor() {
    this.router = Router();
  }

  get<Route extends API.GetRoutes>(route: Route, handler: RouteHandler<Route, 'GET'>) {
    this.handle('GET', route, handler);
  }

  post<Route extends API.PostRoutes>(route: Route, handler: RouteHandler<Route, 'POST'>) {
    this.handle('POST', route, handler);
  }

  handle<Route extends API.Routes, Method extends string>(
    method: Method,
    route: Route,
    handler: RouteHandler<Route, Method>
  ) {
    const expressHandler = async (
      req: Parameters<typeof handler>[0],
      res: Response,
      next: NextFunction
    ) => {
      try {
        const data = await handler(req);
        respond(res, data);
      } catch (e) {
        next(e);
      }
    };

    switch (method.toString()) {
      case 'GET':
        this.router.get(route, expressHandler);
        break;

      case 'POST':
        this.router.post(route, expressHandler);
        break;
    }
  }
}

type RouteHandler<Route extends API.Routes, Method extends string> =
  Method extends keyof API.RouteMap[Route]
    ? (
        req: Request<
          RouteProperty<Route, Method, 'params'>,
          RouteProperty<Route, Method, 'response'>,
          RouteProperty<Route, Method, 'body'>,
          RouteProperty<Route, Method, 'query'>
        >
      ) => Promise<RouteProperty<Route, Method, 'response'>>
    : never;

type RouteProperty<Route extends API.Routes, Method extends string, PropName> =
  Method extends keyof API.RouteMap[Route]
    ? PropName extends keyof API.RouteMap[Route][Method]
      ? API.RouteMap[Route][Method][PropName]
      : never
    : never;
