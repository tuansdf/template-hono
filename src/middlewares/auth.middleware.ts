import { MiddlewareHandler } from "hono";
import { JwtTokenType } from "~/domains/auth/auth.type";
import { permissionUtils } from "~/domains/permission/permission.util";
import { jwtService } from "~/domains/token/jwt.service";
import { JWT_TYPE } from "~/domains/token/token.constant";
import { tokenService } from "~/domains/token/token.service";
import { CustomException } from "~/exceptions/custom-exception";

export const authenticate = (type: JwtTokenType = JWT_TYPE.ACCESS): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    const bearerToken = authHeader.split(" ")[1]?.trim();
    if (!bearerToken) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    const payload = await jwtService.verifyToken(bearerToken, type);
    if (payload.tid && (await tokenService.verifyById(Number(payload.tid)))) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    c.set("authPayload", payload);
    c.set("authToken", bearerToken);

    await next();
  };
};

export const authorize = (perms: string[]): MiddlewareHandler => {
  return async (c, next) => {
    if (perms.length === 0) await next();

    const authPayload = c.get("authPayload");

    if (!authPayload) {
      throw new CustomException("generic.error.not_found", 404);
    }

    const permissions = authPayload.pms;
    if (!permissions?.length) {
      throw new CustomException("generic.error.not_found", 404);
    }

    const hasPerm = perms.some((item) => {
      return permissionUtils.hasPerm(item, permissions);
    });
    if (!hasPerm) {
      throw new CustomException("generic.error.not_found", 404);
    }

    await next();
  };
};
