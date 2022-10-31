import { ZodError } from 'zod';
import createCorsMiddleware from 'cors';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, respondWithError, UnauthorizedError } from './response';
import { getCorsAllowedOrigins, logger } from '@gradejs-public/shared';

const originAllowList = getCorsAllowedOrigins();
export const cors = createCorsMiddleware({
  maxAge: 1800,
  origin: function (origin, callback) {
    if (originAllowList.length === 0 || (origin && originAllowList.includes(origin))) {
      callback(null, true);
    } else {
      callback(null, false);
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
    !(error instanceof UnauthorizedError) &&
    !(error instanceof ZodError)
  ) {
    logger.error(error, req);
  }

  respondWithError(res, error);
}
