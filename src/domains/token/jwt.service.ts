import { JWTPayload } from "jose";
import { ENV } from "~/constants/env.constant";
import { JWT_TYPE } from "~/domains/token/token.constant";
import { AuthJwtTokenPayload, JwtTokenType } from "~/domains/token/token.type";
import { CustomException } from "~/exceptions/custom-exception";
import { dated } from "~/lib/date";
import { jwt } from "~/lib/jwt";

class JwtService {
  public async createAccessTokenPayload(userId: number, userPerms: number[]): Promise<AuthJwtTokenPayload> {
    const now = dated();
    const currentUnix = now.unix();
    const expiresUnix = now.add(ENV.JWT_ACCESS_LIFETIME, "minute").unix();
    const result: AuthJwtTokenPayload = {
      sid: userId,
      pms: userPerms,
      for: JWT_TYPE.ACCESS,
      iat: currentUnix,
      nbf: currentUnix,
      exp: expiresUnix,
    };
    return result;
  }

  public async createRefreshTokenPayload(userId: number): Promise<AuthJwtTokenPayload> {
    const now = dated();
    const currentUnix = now.unix();
    const expiresUnix = now.add(ENV.JWT_REFRESH_LIFETIME, "minute").unix();
    const result: AuthJwtTokenPayload = {
      sid: userId,
      for: JWT_TYPE.REFRESH,
      iat: currentUnix,
      nbf: currentUnix,
      exp: expiresUnix,
    };
    return result;
  }

  public async createActivateAccountTokenPayload(username: string): Promise<AuthJwtTokenPayload> {
    const now = dated();
    const currentUnix = now.unix();
    const expiresUnix = now.add(ENV.TOKEN_ACTIVATE_ACCOUNT_LIFETIME, "minute").unix();
    const result: AuthJwtTokenPayload = {
      sub: username,
      for: JWT_TYPE.ACTIVATE_ACCOUNT,
      iat: currentUnix,
      nbf: currentUnix,
      exp: expiresUnix,
    };
    return result;
  }

  public async createResetPasswordTokenPayload(username: string): Promise<AuthJwtTokenPayload> {
    const now = dated();
    const currentUnix = now.unix();
    const expiresUnix = now.add(ENV.TOKEN_RESET_PASSWORD_LIFETIME, "minute").unix();
    const result: AuthJwtTokenPayload = {
      sub: username,
      for: JWT_TYPE.RESET_PASSWORD,
      iat: currentUnix,
      nbf: currentUnix,
      exp: expiresUnix,
    };
    return result;
  }

  public async createToken(payload: JWTPayload) {
    return jwt.sign(payload);
  }

  public async verifyToken(token: string, type: JwtTokenType = JWT_TYPE.ACCESS): Promise<AuthJwtTokenPayload> {
    try {
      const payload: AuthJwtTokenPayload = await jwt.verify(token);
      if (payload.for !== type) {
        throw new CustomException("auth.error.unauthenticated", 401);
      }
      return payload;
    } catch {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
  }
}

export const jwtService = new JwtService();
