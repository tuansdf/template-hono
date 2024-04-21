import { ENV_JWT_EXPIRED_MINUTES } from "~/constants/env.constant.js";
import { JwtAuthTokenPayload } from "~/domains/auth/auth.type.js";
import { User } from "~/domains/user/user.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { datelib } from "~/lib/date/datelib.js";
import { JwtTokenClaims } from "~/lib/jwt/jwt.type.js";
import { JwtUtils } from "~/lib/jwt/jwt.util.js";

export class AuthUtils {
  static createAuthTokenPayload(user: User): JwtAuthTokenPayload {
    return {
      id: user.id,
      username: user.username,
      type: "auth",
    };
  }

  static createAuthTokenClaims(): JwtTokenClaims {
    const current = datelib();
    const currentUnix = current.unix();
    const expiredUnix = current.add(ENV_JWT_EXPIRED_MINUTES, "minute").unix();
    return {
      exp: expiredUnix,
      iat: currentUnix,
      nbf: currentUnix,
    };
  }

  static async createAuthToken(user: User): Promise<string> {
    const payload = this.createAuthTokenPayload(user);
    const claims = this.createAuthTokenClaims();
    return JwtUtils.sign(payload, claims);
  }

  static async verifyAuthToken(token: string): Promise<JwtAuthTokenPayload> {
    try {
      const payload = await JwtUtils.verify(token);
      if (payload.type !== "auth") {
        throw new CustomException("Unauthorized", 401);
      }
      return payload as JwtAuthTokenPayload;
    } catch (e) {
      throw new CustomException("Unauthorized", 401);
    }
  }
}
