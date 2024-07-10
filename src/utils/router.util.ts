import { Context, Hono } from "hono";
import { Nullish } from "~/types/common.type";
import { StatusCode } from "~/types/status-code.type";

class RouterUtils {
  public init = (cb: (app: Hono) => void) => {
    const instance = new Hono();
    cb(instance);
    return instance;
  };

  public response = (
    c: Context,
    status: StatusCode,
    body?: { data?: Record<string, unknown> | Record<string, unknown>[] | Nullish; message?: string | Nullish },
  ) => {
    const { data = null, message = null } = body || {};
    return c.json({ status, message, data }, status);
  };
}

export const routerUtils = new RouterUtils();
