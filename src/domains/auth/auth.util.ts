import { JWT_TYPE, JWT_TYPE_LIFETIME } from "~/domains/auth/auth.constant";
import { AuthJwtTokenPayload, CreateTokenRequest, JwtTokenType } from "~/domains/auth/auth.type";
import { permissionUtils } from "~/domains/permission/permission.util";
import { CustomException } from "~/exceptions/custom-exception";
import { dated } from "~/lib/date/date";
import { JwtUtils } from "~/lib/jwt/jwt.util";

export class AuthUtils {
  public createTokenPayload(request: CreateTokenRequest): AuthJwtTokenPayload {
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
      case JWT_TYPE.ACTIVATE_ACCOUNT:
      case JWT_TYPE.RESET_PASSWORD:
        return {
          sub: request.username,
          for: request.type,
          iat: currentUnix,
          nbf: currentUnix,
          exp: expiredUnix,
        };
      default:
        const user = request.user || {};
        return {
          sid: user.id,
          for: request.type,
          pms: permissionUtils.dtosToIndexes(user.permissions || []),
          sub: user.username,
          iat: currentUnix,
          nbf: currentUnix,
          exp: expiredUnix,
        };
    }
  }

  public async createToken(request: CreateTokenRequest): Promise<string> {
    const payload = this.createTokenPayload(request);
    return JwtUtils.sign(payload);
  }

  public async verifyToken(token: string, type: JwtTokenType = JWT_TYPE.ACCESS): Promise<AuthJwtTokenPayload> {
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

export const authUtils = new AuthUtils();
