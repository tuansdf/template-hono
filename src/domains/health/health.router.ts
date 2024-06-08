import { Hono } from "hono";
import { db } from "~/database/db";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  await db.healthCheck();
  return c.text("OK");
});

healthRouter.post("/", async (c) => {
  await db.healthCheck();
  return c.text("OK");
});
