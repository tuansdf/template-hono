import { STATUS } from "~/constants/status.constant";
import { tokenRepository } from "~/domains/token/token.repository";
import { TokenSave, TokenValueWithId } from "~/domains/token/token.type";
import { Base64Utils } from "~/lib/base64/base64.util";
import { logger } from "~/lib/logger/logger";

export class TokenService {
  public save = (item: TokenSave) => {
    return tokenRepository.save(item);
  };

  public saveValueWithId = async (item: TokenSave) => {
    const token = await this.save(item);
    const valueObj: TokenValueWithId = {
      v: token.value,
      i: token.id,
    };
    token.value = Base64Utils.encode(JSON.stringify(valueObj));
    await tokenRepository.updateValueByTokenId(token.value, token.id);
    return token;
  };

  public findByValueId = async (tokenValue: string) => {
    try {
      const decoded = Base64Utils.decode(tokenValue);
      const valueWithId = JSON.parse(decoded) as TokenValueWithId;
      const token = await tokenRepository.findTopById(Number(valueWithId.i));
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

  public revokeTokenById = async (tokenId: number, userId: number) => {
    await tokenRepository.updateStatusByTokenIdAndForeignId(STATUS.INACTIVE, tokenId, userId);
  };

  public revokeTokenByUserId = async (userId: number) => {
    await tokenRepository.updateStatusByForeignId(STATUS.INACTIVE, userId);
  };
}

export const tokenService = new TokenService();
