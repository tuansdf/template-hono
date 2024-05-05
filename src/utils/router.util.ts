import { Context, Hono } from "hono";
import { Nullish } from "~/types/common.type.js";
import { StatusCode } from "~/types/status-code.type.js";

export class RouterUtils {
  static init = () => {
    return new Hono();
  };

  static response = (
    c: Context,
    status: StatusCode,
    body?: { data?: Record<string, unknown> | Record<string, unknown>[] | Nullish; message?: string | Nullish },
  ) => {
    const { data = null, message = null } = body || {};
    return c.json({ status, message, data }, status);
  };
}
