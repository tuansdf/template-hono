import { MiddlewareHandler } from "hono";
import { logger } from "~/lib/logger/logger.js";

export const loggerM = (): MiddlewareHandler => async (c, next) => {
  const url = new URL(c.req.url);
  let extra = "";
  switch (c.req.header("content-type")) {
    case "application/json":
      extra += " - application/json: " + JSON.stringify(await c.req.json());
      break;
    case "multipart/form-data":
      extra += " - multipart/form-data: " + JSON.stringify(await c.req.parseBody());
      break;
    case "application/x-www-form-urlencoded":
      extra += " - application/x-www-form-urlencoded: " + JSON.stringify(await c.req.formData());
      break;
  }
  logger.info(`<-- ENTER ${c.req.method} ${url.pathname}${url.search}${extra}`);
  await next();
  logger.info(`--> EXIT ${c.req.method} ${url.pathname} ${c.res.status}`);
};
