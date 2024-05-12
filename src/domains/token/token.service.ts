import { STATUS } from "~/constants/status.constant";
import { TokenRepository } from "~/domains/token/token.repository";
import { TokenSave } from "~/domains/token/token.type";

export class TokenService {
  static save = (item: TokenSave) => {
    return TokenRepository.save(item);
  };

  static revokeTokenById = async (tokenId: number, userId: number) => {
    await TokenRepository.updateStatusByTokenIdAndForeignId(STATUS.INACTIVE, tokenId, userId);
  };

  static revokeTokenByUserId = async (userId: number) => {
    await TokenRepository.updateStatusByForeignId(STATUS.INACTIVE, userId);
  };
}
