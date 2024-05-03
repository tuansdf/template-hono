import { ENV_JWT_ACCESS_LIFETIME, ENV_JWT_REFRESH_LIFETIME } from "~/constants/env.constant.js";
import { JwtAuthTokenPayload, JwtAuthTokenType } from "~/domains/auth/auth.type.js";
import { PermissionUtils } from "~/domains/permission/permission.util.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { dated } from "~/lib/date/date.js";
import { JwtTokenClaims } from "~/lib/jwt/jwt.type.js";
import { JwtUtils } from "~/lib/jwt/jwt.util.js";

export class AuthUtils {
  static createTokenPayload(user: UserDTO, type: JwtAuthTokenType = "access"): JwtAuthTokenPayload {
    return {
      userId: user.id,
      username: user.username,
      type,
      perms: PermissionUtils.codesToBinaries(user.permissions?.map((item) => item.code) || []),
    };
  }

  static createTokenClaims(type: JwtAuthTokenType = "access"): JwtTokenClaims {
    const current = dated();
    const currentUnix = current.unix();
    const expiredUnix = current
      .add(type === "access" ? ENV_JWT_ACCESS_LIFETIME : ENV_JWT_REFRESH_LIFETIME, "minute")
      .unix();
    return {
      exp: expiredUnix,
      iat: currentUnix,
      nbf: currentUnix,
    };
  }

  static async createToken(user: UserDTO, type: JwtAuthTokenType = "access"): Promise<string> {
    const payload = this.createTokenPayload(user, type);
    const claims = this.createTokenClaims(type);
    return JwtUtils.sign(payload, claims);
  }

  static async verifyToken(token: string, type: JwtAuthTokenType = "access"): Promise<JwtAuthTokenPayload> {
    try {
      const payload: JwtAuthTokenPayload = await JwtUtils.verify(token);
      if (payload.type !== type) {
        throw new CustomException("auth.error.unauthenticated", 401);
      }
      return payload as JwtAuthTokenPayload;
    } catch (e) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
  }
}
