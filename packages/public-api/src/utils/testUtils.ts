import supertest from 'supertest';
import { createApp } from '../app';

export function createSupertestApi() {
  const server = createApp().listen(4000);
  const api = supertest.agent(server);

  afterAll(async () => {
    await server.close();
  });

  return api;
}
