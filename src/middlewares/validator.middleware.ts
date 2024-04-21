import { Handler } from "hono";
import { validator } from "hono/validator";

export class ValidatorMiddleware {
  static validate =
    (...params: Parameters<typeof validator>): Handler =>
    (c, next) => {
      // validator();
    };
}
