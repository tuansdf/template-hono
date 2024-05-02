import { MiddlewareHandler } from "hono";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { PermissionUtils } from "~/domains/permission/permission.util.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export const authenticate = (): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    const bearerToken = authHeader.split(" ")[1];

    if (!bearerToken) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    const payload = await AuthUtils.verifyAuthToken(bearerToken);
    c.set("authPayload", payload);

    await next();
  };
};

export const authorize = (perms: string[]): MiddlewareHandler => {
  return async (c, next) => {
    if (perms.length === 0) await next();

    const authPayload = c.get("authPayload");

    if (!authPayload) {
      throw new CustomException("common.error.not_found", 404);
    }

    if (!authPayload.perms?.length) {
      throw new CustomException("common.error.not_found", 404);
    }
    const userPerms = authPayload.perms;

    const hasPerm = perms.some((item) => {
      return PermissionUtils.hasPerm(item, userPerms);
    });
    if (!hasPerm) {
      throw new CustomException("common.error.not_found", 404);
    }

    await next();
  };
};
