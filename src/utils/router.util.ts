import { Context, Hono } from "hono";
import { CommonResponse } from "~/types/common.type.js";

export class RouterUtils {
  static init = () => {
    return new Hono();
  };

  static response = (c: Context, { data = null, message = null, status }: CommonResponse) => {
    return c.json({ status, message, data }, status);
  };
}
