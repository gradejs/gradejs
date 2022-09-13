import { NextFunction, Request, Response } from 'express';
import { getGradeJsApiKey } from '@gradejs-public/shared';
import { UnauthorizedError } from './response';

const API_TOKEN_HEADER = 'X-Api-Key';

export function verifySystemApiToken(req: Request, _res: Response, next: NextFunction) {
  if (req.headers[API_TOKEN_HEADER.toLowerCase()] !== getGradeJsApiKey()) {
    next(new UnauthorizedError());
    return;
  }

  next();
}
