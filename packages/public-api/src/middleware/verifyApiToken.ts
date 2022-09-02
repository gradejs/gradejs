import { NextFunction, Request, Response } from 'express';
import { getGradeJsApiKey } from '@gradejs-public/shared';
import { UnauthorizedError } from './response';

const API_TOKEN_HEADER = 'X-Api-Token';

export function verifyApiToken(req: Request, _res: Response, next: NextFunction) {
  if (req.headers[API_TOKEN_HEADER] !== getGradeJsApiKey()) {
    throw new UnauthorizedError();
  }

  next();
}
