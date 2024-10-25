import { Hono } from "hono";
import { db } from "~/database/db";

export const healthRouter = new Hono();

healthRouter.all("/", async (c) => {
  await db.healthCheck();
  return c.text("OK");
});
