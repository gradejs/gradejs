import { Request } from 'express';
import j, { AnySchema, StringSchema } from 'joi';

/**
 * Usefull wrapper for better validation typing and good-looking code (body json payload)
 * @example
 * // POST /login { email: '...' }
 * const email = parseBody(req, 'email', joi.string().email())
 */
export function parseBody(req: Request, param: string, schema: StringSchema): string;
export function parseBody(req: Request, param: string, schema: AnySchema) {
  return parse(req, 'body', param, schema);
}

/**
 * Usefull wrapper for better validation typing and good-looking code (query params)
 * @example
 * // GET /devices?token=xxx
 * const token = parseQuery(req, 'token', joi.string().email())
 */
export function parseQuery(req: Request, param: string, schema: StringSchema): string;
export function parseQuery(req: Request, param: string, schema: AnySchema) {
  return parse(req, 'query', param, schema);
}

/**
 * Usefull wrapper for better validation typing and good-looking code (slug)
 * @example
 * // GET /devices/:slug
 * const slug = parseSlug(req, 'slug', joi.string().email())
 */
export function parseSlug(req: Request, param: string, schema: StringSchema): string;
export function parseSlug(req: Request, param: string, schema: AnySchema) {
  return parse(req, 'params', param, schema);
}

function parse(req: Request, where: string, param: string, schema: AnySchema): unknown {
  const extendedSchema = j
    .object({
      [where]: j
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

  return value[where][param];
}
