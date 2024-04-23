import { Handler } from "hono";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export class AuthMiddleware {
  static authenticate(): Handler {
    return async (c, next) => {
      const t = c.get("t");
      const authHeader = c.req.header("Authorization");
      if (!authHeader) {
        throw new CustomException(t("auth.error.unauthenticated"), 401);
      }

      if (!authHeader.startsWith("Bearer ")) {
        throw new CustomException(t("auth.error.unauthenticated"), 401);
      }

      const bearerToken = authHeader.split(" ")[1];

      if (!bearerToken) {
        throw new CustomException(t("auth.error.unauthenticated"), 401);
      }

      const payload = await AuthUtils.verifyAuthToken(bearerToken, t);
      c.set("authPayload", payload);

      await next();
    };
  }

  static authorize(perms: string[]): Handler {
    return async (c, next) => {
      if (perms.length === 0) await next();

      const t = c.get("t");
      const authPayload = c.get("authPayload");

      if (!authPayload.permissions?.length) {
        throw new CustomException(t("auth.error.unauthorized"), 403);
      }

      const hasPerm = perms.some((item) => authPayload.permissions?.includes(item));
      if (!hasPerm) {
        throw new CustomException(t("auth.error.unauthorized"), 403);
      }

      await next();
    };
  }
}
