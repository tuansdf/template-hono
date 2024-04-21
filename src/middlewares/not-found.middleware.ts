import { NotFoundHandler } from "hono";

export class NotFoundMiddleware {
  static handle(): NotFoundHandler {
    return (c) => {
      return c.json({ status: 404, message: "Not Found" }, 400);
    };
  }
}
