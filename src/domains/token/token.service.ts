import { TokenRepository } from "~/domains/token/token.repository";
import { TokenSave } from "~/domains/token/token.type";

export class TokenService {
  static save = (item: TokenSave) => {
    return TokenRepository.save(item);
  };
}
