import { Handler } from "hono";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export class AuthMiddleware {
  static authenticate(): Handler {
    return async (c, next) => {
      try {
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
          throw new CustomException("Unauthorized", 401);
        }

        if (!authHeader.startsWith("Bearer ")) {
          throw new CustomException("Unauthorized", 401);
        }
        const bearerToken = authHeader.split(" ")[1];

        if (!bearerToken) {
          throw new CustomException("Unauthorized", 401);
        }

        const payload = AuthUtils.verifyAuthToken(bearerToken);
        c.set("authPayload", payload);
      } catch (e) {
        throw new CustomException("Unauthorized", 401);
      } finally {
        await next();
      }
    };
  }
}
