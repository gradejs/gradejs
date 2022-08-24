import { z, ZodString } from 'zod';

type ZodLike<T> = { [K in keyof T]: T[K] extends string ? ZodString : never };

export function getRequestParams<Params>(request: { params: Params }, schema: ZodLike<Params>) {
  return z.object(schema).parse(request.params);
}

export function getRequestBody<Body>(request: { body: Body }, schema: ZodLike<Body>) {
  return z.object(schema).parse(request.body);
}

export function getRequestQuery<Query>(request: { query: Query }, schema: ZodLike<Query>) {
  return z.object(schema).parse(request.query);
}
