import { JWT_TYPE, JWT_TYPE_LIFETIME } from "~/domains/auth/auth.constant.js";
import { AuthJwtTokenPayload, CreateTokenRequest, JwtTokenType } from "~/domains/auth/auth.type.js";
import { PermissionUtils } from "~/domains/permission/permission.util.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { dated } from "~/lib/date/date.js";
import { JwtUtils } from "~/lib/jwt/jwt.util.js";

export class AuthUtils {
  static createTokenPayload(request: CreateTokenRequest): AuthJwtTokenPayload {
    const current = dated();
    const currentUnix = current.unix();
    const expiredUnix = current.add(JWT_TYPE_LIFETIME[request.type], "minute").unix();

    switch (request.type) {
      case JWT_TYPE.REFRESH:
        return {
          sid: request.user.id,
          for: request.type,
          iat: currentUnix,
          nbf: currentUnix,
          exp: expiredUnix,
        };
      case JWT_TYPE.RESET_PASSWORD:
        return {
          sub: request.username,
          for: request.type,
          iat: currentUnix,
          nbf: currentUnix,
          exp: expiredUnix,
        };
      default:
        return {
          sid: request.user.id,
          for: request.type,
          pms: PermissionUtils.dtosToIndexes(request.user.permissions || []),
          sub: request.user.username,
          iat: currentUnix,
          nbf: currentUnix,
          exp: expiredUnix,
        };
    }
  }

  static async createToken(request: CreateTokenRequest): Promise<string> {
    const payload = this.createTokenPayload(request);
    return JwtUtils.sign(payload);
  }

  static async verifyToken(token: string, type: JwtTokenType = JWT_TYPE.ACCESS): Promise<AuthJwtTokenPayload> {
    try {
      const payload: AuthJwtTokenPayload = await JwtUtils.verify(token);
      if (payload.for !== type) {
        throw new CustomException("auth.error.unauthenticated", 401);
      }
      return payload as AuthJwtTokenPayload;
    } catch (e) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
  }
}
