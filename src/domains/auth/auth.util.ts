import { JWT_TYPE, JWT_TYPE_LIFETIME } from "~/domains/auth/auth.constant";
import { AuthJwtTokenPayload, CreateTokenRequest, JwtTokenType } from "~/domains/auth/auth.type";
import { permissionUtils } from "~/domains/permission/permission.util";
import { CustomException } from "~/exceptions/custom-exception";
import { dated } from "~/lib/date/date";
import { jwt } from "~/lib/jwt/jwt.util";

class AuthUtils {
  public createTokenPayload(request: CreateTokenRequest): AuthJwtTokenPayload {
    const current = dated();
    const currentUnix = current.unix();
    const expiredUnix = current.add(JWT_TYPE_LIFETIME[request.type], "minute").unix();
    const result: AuthJwtTokenPayload = {
      iat: currentUnix,
      nbf: currentUnix,
      exp: expiredUnix,
      for: request.type,
    };

    switch (request.type) {
      case JWT_TYPE.ACTIVATE_ACCOUNT:
      case JWT_TYPE.RESET_PASSWORD:
        result.sub = request.username;
        break;
      case JWT_TYPE.REFRESH:
        result.sid = request.user.id;
        break;
      case JWT_TYPE.ACCESS:
        result.sid = request.user.id;
        result.pms = permissionUtils.dtosToIndexes(request.user.permissions || []);
        break;
    }

    return result;
  }

  public async createToken(request: CreateTokenRequest): Promise<string> {
    const payload = this.createTokenPayload(request);
    return jwt.sign(payload);
  }

  public async verifyToken(token: string, type: JwtTokenType = JWT_TYPE.ACCESS): Promise<AuthJwtTokenPayload> {
    try {
      const payload: AuthJwtTokenPayload = await jwt.verify(token);
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
