import { HTTPException } from "hono/http-exception";
import { StatusCode } from "~/types/status-code.type.js";

export class CustomException extends HTTPException {
  constructor(message?: string, status?: StatusCode) {
    super(status || 400, { message: message || "Bad Request" });
  }
}
