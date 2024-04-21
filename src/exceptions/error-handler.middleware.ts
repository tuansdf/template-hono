import { ErrorHandler } from "hono";
import { CustomException } from "./custom-exception.ts";

export class ErrorHandlerMiddleware {
  static handle(): ErrorHandler {
    return (err: unknown, c) => {
      console.error({ err });
      if (err instanceof CustomException) {
        const status = err.status as any;
        return c.json({ status: status, message: err.message }, status);
      }
      return c.json({ status: 500, message: "Something Went Wrong" }, 500);
    };
  }
}
