import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export class ErrorHandlerMiddleware {
  static handle(): ErrorHandler {
    return (err, c) => {
      console.error(err);
      if (err instanceof HTTPException) {
        return c.json({ status: err.status, message: err.message }, err.status);
      }
      return c.json({ status: 500, message: "Something Went Wrong" }, 500);
    };
  }
}
