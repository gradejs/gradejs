import { ValidationError } from 'joi';
import createCorsMiddleware from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { NotFoundError, respondWithError } from './response';

// TODO: add whitelist origins
export const cors = createCorsMiddleware({ maxAge: 1800 });
export const parseJson = express.json();

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
  if (!(error instanceof NotFoundError) && !(error instanceof ValidationError)) {
    // TODO: add logger
    console.error(error, req);
  }

  respondWithError(res, error);
}

export function wrapTryCatch(func: (req: Request, res: Response) => Promise<void>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res);
    } catch (error) {
      next(error);
    }
  };
}
