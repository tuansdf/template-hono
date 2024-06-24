import { MiddlewareHandler } from "hono";
import { JWT_TYPE, TOKEN_TYPE } from "~/domains/auth/auth.constant";
import { JwtTokenType, TokenType } from "~/domains/auth/auth.type";
import { authUtils } from "~/domains/auth/auth.util";
import { permissionUtils } from "~/domains/permission/permission.util";
import { TokenValueWithId } from "~/domains/token/token.type";
import { CustomException } from "~/exceptions/custom-exception";
import { Base64Utils } from "~/lib/base64/base64.util";

export const authenticate = (
  type: JwtTokenType = JWT_TYPE.ACCESS,
  tokenType: TokenType = TOKEN_TYPE.JWT,
): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    let bearerToken = authHeader.split(" ")[1];
    if (!bearerToken) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    try {
      if (tokenType === TOKEN_TYPE.JWT_WITH_ID) {
        const decoded = Base64Utils.decode(bearerToken);
        const obj: TokenValueWithId = JSON.parse(decoded);
        bearerToken = obj.v;
      }
    } catch (e) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    if (!bearerToken) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }

    const payload = await authUtils.verifyToken(bearerToken, type);
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
