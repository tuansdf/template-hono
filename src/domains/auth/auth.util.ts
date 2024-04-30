import { ENV_JWT_EXPIRED_MINUTES } from "~/constants/env.constant.js";
import { JwtAuthTokenPayload } from "~/domains/auth/auth.type.js";
import { PermissionUtils } from "~/domains/permission/permission.util.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { TFn } from "~/i18n/i18n.type.js";
import { dated } from "~/lib/date/date.js";
import { JwtTokenClaims } from "~/lib/jwt/jwt.type.js";
import { JwtUtils } from "~/lib/jwt/jwt.util.js";

export class AuthUtils {
  static createAuthTokenPayload(user: UserDTO): JwtAuthTokenPayload {
    return {
      userId: user.id,
      username: user.username,
      type: "auth",
      perms: PermissionUtils.codesToBinaries(user.permissions?.map((item) => item.code) || []),
    };
  }

  static createAuthTokenClaims(): JwtTokenClaims {
    const current = dated();
    const currentUnix = current.unix();
    const expiredUnix = current.add(ENV_JWT_EXPIRED_MINUTES, "minute").unix();
    return {
      exp: expiredUnix,
      iat: currentUnix,
      nbf: currentUnix,
    };
  }

  static async createAuthToken(user: UserDTO): Promise<string> {
    const payload = this.createAuthTokenPayload(user);
    const claims = this.createAuthTokenClaims();
    return JwtUtils.sign(payload, claims);
  }

  static async verifyAuthToken(token: string, t: TFn): Promise<JwtAuthTokenPayload> {
    try {
      const payload = await JwtUtils.verify(token);
      if (payload.type !== "auth") {
        throw new CustomException(t("auth.error.unauthenticated"), 401);
      }
      return payload as JwtAuthTokenPayload;
    } catch (e) {
      throw new CustomException(t("auth.error.unauthenticated"), 401);
    }
  }
}
