import { Response } from 'express';
import { ValidationError } from 'joi';

export type ApiResponse<TData = undefined> = { data: TData } | { error: ApiDetailedError };

export type ApiDetailedError = {
  code: number;
  message?: string;
  param?: string;
  type?: string;
};

export class NotFoundError extends Error {
  code = 404;
  message = 'Not Found';
}

export function respond<T>(res: Response, data: T) {
  res.send({
    data,
  } as ApiResponse<T>);
}

export function respondWithError(res: Response, err: unknown) {
  const error: ApiDetailedError = {
    code: 500,
    message: 'Internal server error, try again later',
  };

  if (err instanceof NotFoundError) {
    error.code = err.code;
    error.message = err.message;
  }

  if (err instanceof ValidationError) {
    const details = err.details[0];
    error.code = 400;
    error.message = details.message || err.message;
    error.type = details.type;
    error.param = details.path.join('.');
  }

  res.status(error.code);
  res.send({
    error,
  } as ApiResponse);
}
