import { Hono } from "hono";

export const healthRouter = new Hono();

healthRouter.all("/", async () => {
  return new Response("OK");
});
