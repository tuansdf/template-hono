import { Handler } from "hono";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export class AuthMiddleware {
  static authenticate(): Handler {
    return async (c, next) => {
      const t = c.get("t");
      const authHeader = c.req.header("Authorization");
      if (!authHeader) {
        throw new CustomException(t("auth.error.unauthorized"), 401);
      }

      if (!authHeader.startsWith("Bearer ")) {
        throw new CustomException(t("auth.error.unauthorized"), 401);
      }

      const bearerToken = authHeader.split(" ")[1];

      if (!bearerToken) {
        throw new CustomException(t("auth.error.unauthorized"), 401);
      }

      const payload = await AuthUtils.verifyAuthToken(bearerToken, t);
      c.set("authPayload", payload);

      await next();
    };
  }
}
