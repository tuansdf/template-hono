import { MiddlewareHandler } from "hono";
import { logger } from "~/lib/logger/logger.js";

export const loggerM = (): MiddlewareHandler => async (c, next) => {
  logger.info(
    `<-- ${c.req.method} ${c.req.path} - QUERY: ${JSON.stringify(c.req.query())} - PARAM: ${JSON.stringify(c.req.param())}`,
  );
  await next();
  logger.info(`--> ${c.req.method} ${c.req.path} ${c.res.status}`);
};
