import { ZodError } from 'zod';
import createCorsMiddleware from 'cors';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, respondWithError } from './response';
import { getCorsAllowedOrigins } from '@gradejs-public/shared';
export class CorsError extends Error {
  code = 400;
  message = 'Not allowed by CORS';
}

const originAllowList = getCorsAllowedOrigins();
export const cors = createCorsMiddleware({
  maxAge: 1800,
  origin: function (origin, callback) {
    if (origin && originAllowList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new CorsError());
    }
  },
});

/**
 * Handles any unknown routes by default
 */
export function endpointMissingMiddleware(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError());
}

/**
 * All errors are going down to error handler.
 * This will respond to request with good-looking error and log this error into rollbar
 */
export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log only useful errors
  if (
    !(error instanceof NotFoundError) &&
    !(error instanceof CorsError) &&
    !(error instanceof ZodError)
  ) {
    // TODO: add logger
    console.error(error, req);
  }

  respondWithError(res, error);
}
