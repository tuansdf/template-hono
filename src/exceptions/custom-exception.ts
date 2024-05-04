import { HTTPException } from "hono/http-exception";
import { StatusCode } from "~/types/status-code.type.js";

export class CustomException extends HTTPException {
  constructor(message?: string, status?: StatusCode) {
    const s = status || 400;
    const m = message || "Bad Request";
    super(s, { message: m });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new HTTPException(s, { message: m }).stack;
    }
  }
}
