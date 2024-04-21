import { Hono } from "hono";
import { HealthService } from "~/domains/health/health.service.ts";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  const result = await HealthService.check();
  return c.text(result);
});
