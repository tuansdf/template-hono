import { STATUS } from "@/constants/status.constant";
import { TYPE } from "@/constants/type.constant";
import { jwtService } from "@/domains/token/jwt.service";
import { tokenRepository } from "@/domains/token/token.repository";
import { TokenSave } from "@/domains/token/token.type";
import { dated } from "@/lib/date";
import { logger } from "@/lib/logger";
import { uuid } from "@/lib/uuid";

class TokenService {
  public async save(item: TokenSave) {
    return tokenRepository.save(item);
  }

  public async findOneById(tokenId: string) {
    try {
      const token = await tokenRepository.findTopById(tokenId);
      if (!token) {
        throw new Error();
      }
      return token;
    } catch (e) {
      logger.error("ERROR ERROR_FIND_TOKEN_BY_VALUE_ID", e);
      return null;
    }
  }

  public async revokeTokenById(tokenId: string, userId: string) {
    await tokenRepository.updateStatusByTokenIdAndForeignId(STATUS.INACTIVE, tokenId, userId);
  }

  public async revokeTokenByForeignId(foreignId: string) {
    await tokenRepository.updateStatusByForeignId(STATUS.INACTIVE, foreignId);
  }

  public async verifyById(id: string): Promise<boolean> {
    try {
      const token = await tokenRepository.findTopById(id);
      if (!token || !token.value || !token.expiresAt || !token.status) return false;
      const isExpired = dated().isAfter(token.expiresAt);
      if (isExpired) return false;
      const isInActive = token.status === STATUS.INACTIVE;
      if (isInActive) return false;
      return true;
    } catch {
      return false;
    }
  }

  public async createActivateAccountToken({ userId, userUsername }: { userId: string; userUsername: string }) {
    const id = uuid();
    const tokenPayload = await jwtService.createActivateAccountTokenPayload(userUsername, id);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      id,
      foreignId: userId,
      value: tokenValue,
      type: TYPE.ACTIVATE_ACCOUNT,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return this.save(item);
  }

  public async createResetPasswordToken({ userId, userUsername }: { userId: string; userUsername: string }) {
    const id = uuid();
    const tokenPayload = await jwtService.createResetPasswordTokenPayload(userUsername, id);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      id,
      foreignId: userId,
      value: tokenValue,
      type: TYPE.RESET_PASSWORD,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return this.save(item);
  }

  public async createRefreshToken({ userId }: { userId: string }) {
    const id = uuid();
    const tokenPayload = await jwtService.createRefreshTokenPayload(userId, id);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      id,
      foreignId: userId,
      value: tokenValue,
      type: TYPE.REFRESH_TOKEN,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return this.save(item);
  }
}

export const tokenService = new TokenService();
