import { ZodError } from 'zod';
import createCorsMiddleware from 'cors';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, respondWithError } from './response';

const originAllowList = {
  production: ['https://gradejs.com'],
  staging: ['https://staging.gradejs.com', 'http://localhost:3000'],
  development: ['http://localhost:3000'],
};

const getNodeEnv = () => {
  if (
    !process.env.NODE_ENV ||
    !['production', 'staging', 'development'].includes(process.env.NODE_ENV)
  ) {
    return 'development';
  }
  return process.env.NODE_ENV as 'production' | 'staging' | 'development';
};

export const cors = createCorsMiddleware({
  maxAge: 1800,
  origin: function (origin, callback) {
    if (origin && originAllowList[getNodeEnv()].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
  if (!(error instanceof NotFoundError) && !(error instanceof ZodError)) {
    // TODO: add logger
    console.error(error, req);
  }

  respondWithError(res, error);
}
