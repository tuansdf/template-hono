import { MiddlewareHandler } from "hono";
import { logger } from "~/lib/logger/logger.js";

export const loggerM = (): MiddlewareHandler => async (c, next) => {
  const url = new URL(c.req.url);
  logger.info(`ENTER ${c.req.method} ${url.pathname}${url.search}`);
  await next();
  logger.info(`EXIT ${c.req.method} ${url.pathname} ${c.res.status}`);
};
