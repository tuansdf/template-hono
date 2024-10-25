import { STATUS } from "~/constants/status.constant";
import { TYPE } from "~/constants/type.constant";
import { jwtService } from "~/domains/token/jwt.service";
import { tokenRepository } from "~/domains/token/token.repository";
import { TokenSave, TokenValueWithId } from "~/domains/token/token.type";
import { CustomException } from "~/exceptions/custom-exception";
import { base64 } from "~/lib/base64/base64";
import { dated } from "~/lib/date/date";
import { logger } from "~/lib/logger/logger";

class TokenService {
  public async save(item: TokenSave) {
    return tokenRepository.save(item);
  }

  public async saveValueWithId(item: TokenSave) {
    delete item.id;
    const token = await this.save(item);
    if (!token) {
      throw new CustomException("dynamic.error.not_found:::field.token");
    }
    const valueObj: TokenValueWithId = {
      v: token.value,
      i: token.id,
    };
    token.value = base64.encode(JSON.stringify(valueObj));
    return token;
  }

  public async findByValueId(tokenValue: string) {
    try {
      const decoded = base64.decode(tokenValue);
      const valueWithId = JSON.parse(decoded) as TokenValueWithId;
      const token = await tokenRepository.findTopById(Number(valueWithId.i));
      if (!token || token.value !== valueWithId.v) {
        throw new Error();
      }
      return token;
    } catch (e) {
      logger.error("ERROR ERROR_FIND_TOKEN_BY_VALUE_ID", e);
      return null;
    }
  }

  public async revokeTokenById(tokenId: number, userId: number) {
    await tokenRepository.updateStatusByTokenIdAndForeignId(STATUS.INACTIVE, tokenId, userId);
  }

  public async revokeTokenByUserId(userId: number) {
    await tokenRepository.updateStatusByForeignId(STATUS.INACTIVE, userId);
  }

  public async verifyById(id: number): Promise<boolean> {
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

  public async createActivateAccountToken({ userId, userUsername }: { userId: number; userUsername: string }) {
    const tokenPayload = await jwtService.createActivateAccountTokenPayload(userUsername);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      foreignId: userId,
      value: tokenValue,
      type: TYPE.ACTIVATE_ACCOUNT,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return tokenService.saveValueWithId(item);
  }

  public async createResetPasswordToken({ userId, userUsername }: { userId: number; userUsername: string }) {
    const tokenPayload = await jwtService.createResetPasswordTokenPayload(userUsername);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      foreignId: userId,
      value: tokenValue,
      type: TYPE.RESET_PASSWORD,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return tokenService.saveValueWithId(item);
  }

  public async createRefreshToken({ userId }: { userId: number }) {
    const tokenPayload = await jwtService.createRefreshTokenPayload(userId);
    const tokenValue = await jwtService.createToken(tokenPayload);
    const item: TokenSave = {
      foreignId: userId,
      value: tokenValue,
      type: TYPE.REFRESH_TOKEN,
      expiresAt: new Date(tokenPayload.exp! * 1000),
      status: STATUS.ACTIVE,
    };
    return tokenService.saveValueWithId(item);
  }
}

export const tokenService = new TokenService();
