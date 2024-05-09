import { Hono } from "hono";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  return c.text("OK");
});

healthRouter.post("/", async (c) => {
  return c.text("OK");
});
