import { Request } from 'express';
import j, { AnySchema, StringSchema } from 'joi';

/**
 * Usefull wrapper for better validation typing and good-looking code (body json payload)
 * @example
 * // POST /login { email: '...' }
 * const email = parseBody(req, 'email', joi.string().email())
 */
export function parseBody(req: Request, param: string, schema: StringSchema): string;
export function parseBody(req: Request, param: string, schema: AnySchema): unknown {
  const extendedSchema = j
    .object({
      body: j
        .object({
          [param]: schema,
        })
        .unknown(true),
    })
    .unknown(true);

  const { value, error } = extendedSchema.validate(req);

  if (error) {
    throw error;
  }

  return value.body[param];
}

/**
 * Usefull wrapper for better validation typing and good-looking code (query params)
 * @example
 * // GET /devices?token=xxx
 * const token = parseQuery(req, 'token', joi.string().email())
 */
export function parseQuery(req: Request, param: string, schema: StringSchema): string;
export function parseQuery(req: Request, param: string, schema: AnySchema): unknown {
  const extendedSchema = j
    .object({
      query: j
        .object({
          [param]: schema,
        })
        .unknown(true),
    })
    .unknown(true);

  const { value, error } = extendedSchema.validate(req);

  if (error) {
    throw error;
  }

  return value.query[param];
}
