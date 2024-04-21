import { Hono } from "hono";

export class RouterUtils {
  static init() {
    return new Hono();
  }
}
