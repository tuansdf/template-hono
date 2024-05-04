import { ENV_JWT_ACCESS_LIFETIME, ENV_JWT_REFRESH_LIFETIME } from "~/constants/env.constant.js";
import { AuthJwtTokenPayload } from "~/domains/auth/auth.type.js";
import { PermissionUtils } from "~/domains/permission/permission.util.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { dated } from "~/lib/date/date.js";
import { JWT_TYPE } from "~/lib/jwt/jwt.constant.js";
import { JwtTokenType } from "~/lib/jwt/jwt.type.js";
import { JwtUtils } from "~/lib/jwt/jwt.util.js";

export class AuthUtils {
  static createTokenPayload(user: UserDTO, type: JwtTokenType = JWT_TYPE.ACCESS): AuthJwtTokenPayload {
    const current = dated();
    const currentUnix = current.unix();
    const expiredUnix = current
      .add(type === JWT_TYPE.REFRESH ? ENV_JWT_REFRESH_LIFETIME : ENV_JWT_ACCESS_LIFETIME, "minute")
      .unix();

    return {
      sub: user.username,
      exp: expiredUnix,
      iat: currentUnix,
      nbf: currentUnix,

      sid: user.id,
      for: type,
      pms: PermissionUtils.codesToIndexes(user.permissions?.map((item) => item.code) || []),
    };
  }

  static async createToken(user: UserDTO, type: JwtTokenType = JWT_TYPE.ACCESS): Promise<string> {
    const payload = this.createTokenPayload(user, type);
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
