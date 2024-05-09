import { HTTPException } from "hono/http-exception";
import { StatusCode } from "~/types/status-code.type";

export class CustomException extends HTTPException {
  constructor(message?: string, status?: StatusCode) {
    const s = status || 400;
    const m = message || "Bad Request";
    super(s, { message: m });

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
