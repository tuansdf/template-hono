import { Hono } from "hono";
import { HealthService } from "~/domains/health/health.service.js";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  const result = await HealthService.check();
  return c.text(result);
});
