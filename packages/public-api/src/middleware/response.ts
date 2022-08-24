import { API } from '@gradejs-public/shared';
import { Response } from 'express';
import { ZodError } from 'zod';
import { CorsError } from './common';

export class NotFoundError extends Error {
  code = 404;
  message = 'Not Found';
}

export function respond<T>(res: Response, data: T) {
  res.send({
    data,
  } as API.Response<T>);
}

export function respondWithError(res: Response, err: unknown) {
  const error: API.Error = {
    code: 500,
    message: 'Internal server error, try again later',
  };

  if (err instanceof NotFoundError || err instanceof CorsError) {
    error.code = err.code;
    error.message = err.message;
  }

  if (err instanceof ZodError) {
    const details = err.errors[0];

    error.code = 400;
    error.message = details.message || err.message;
    error.type = details.code;
    error.param = details.path.join('.');
  }

  res.status(error.code);
  res.send({
    error,
  } as API.Response);
}
