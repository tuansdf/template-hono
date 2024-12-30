import { MiddlewareHandler } from "hono";
import { logger } from "@/lib/logger";

export const loggerM = (): MiddlewareHandler => async (c, next) => {
  let extra = "";
  if (c.req.method !== "GET") {
    try {
      switch (c.req.header("content-type")) {
        case "application/json":
          extra += " application/json:" + JSON.stringify(await c.req.json());
          break;
        case "multipart/form-data":
          extra += " multipart/form-data:" + JSON.stringify(await c.req.parseBody());
          break;
        case "application/x-www-form-urlencoded":
          extra += " application/x-www-form-urlencoded:" + JSON.stringify(await c.req.formData());
          break;
      }
    } catch {
      /* empty */
    }
  }
  const url = new URL(c.req.url);
  const pathname = url.pathname;
  const search = url.search;
  const method = c.req.method.padEnd(7, " ");
  logger.info(`<-- ENTER ${method} ${pathname}${search}${extra}`);
  await next();
  logger.info(`--> EXIT  ${method} ${pathname} ${c.res.status}`);
};
