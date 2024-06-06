import { STATUS } from "~/constants/status.constant";
import { TokenRepository } from "~/domains/token/token.repository";
import { TokenSave, TokenValueWithId } from "~/domains/token/token.type";
import { Base64Utils } from "~/lib/base64/base64.util";
import { logger } from "~/lib/logger/logger";

export class TokenService {
  static save = (item: TokenSave) => {
    return TokenRepository.save(item);
  };

  static saveValueWithId = async (item: TokenSave) => {
    const token = await TokenService.save(item);
    const valueObj: TokenValueWithId = {
      v: token.value,
      i: token.id,
    };
    token.value = Base64Utils.encode(JSON.stringify(valueObj));
    await TokenRepository.updateValueByTokenId(token.value, token.id);
    return token;
  };

  static findByValueId = async (tokenValue: string) => {
    try {
      const decoded = Base64Utils.decode(tokenValue);
      const valueWithId = JSON.parse(decoded) as TokenValueWithId;
      const token = await TokenRepository.findTopById(Number(valueWithId.i));
      if (!token || token.value !== tokenValue) {
        throw new Error();
      }
      token.value = valueWithId.v || "";
      return token;
    } catch (e) {
      logger.error("ERROR ERROR_FIND_TOKEN_BY_VALUE_ID", e);
      return null;
    }
  };

  static revokeTokenById = async (tokenId: number, userId: number) => {
    await TokenRepository.updateStatusByTokenIdAndForeignId(STATUS.INACTIVE, tokenId, userId);
  };

  static revokeTokenByUserId = async (userId: number) => {
    await TokenRepository.updateStatusByForeignId(STATUS.INACTIVE, userId);
  };
}
