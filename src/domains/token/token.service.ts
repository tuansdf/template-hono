import { STATUS } from "~/constants/status.constant";
import { tokenRepository } from "~/domains/token/token.repository";
import { TokenSave, TokenValueWithId } from "~/domains/token/token.type";
import { CustomException } from "~/exceptions/custom-exception";
import { base64Utils } from "~/lib/base64/base64.util";
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
    token.value = base64Utils.encode(JSON.stringify(valueObj));
    return token;
  }

  public async findByValueId(tokenValue: string) {
    try {
      const decoded = base64Utils.decode(tokenValue);
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
}

export const tokenService = new TokenService();
