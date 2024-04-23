import { and, eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { UserRepository } from "~/domains/user/user.repository.js";
import { UserSearchRequestDTO } from "~/domains/user/user.type.js";
import { UserTable } from "~/entities/user.entity.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { TFn } from "~/i18n/i18n.type.js";

export class UserService {
  static async findOneById(userId: number, t: TFn) {
    const user = await UserRepository.findTopById(userId);
    if (!user) {
      throw new CustomException(t("user.error.not_found"), 404);
    }
    return user;
  }

  static async findOneByUsername(username: string, t: TFn) {
    const user = await UserRepository.findTopByUsernameOrEmailWithPassword(username);
    if (!user) {
      throw new CustomException(t("user.error.not_found"), 404);
    }
    return user;
  }

  static async findOneByEmail(email: string, t: TFn) {
    const user = await UserRepository.findTopByEmail(email);
    if (!user) {
      throw new CustomException(t("user.error.not_found"), 404);
    }
    return user;
  }

  static async findAll() {
    return UserRepository.findAll();
  }

  static async search(requestDTO: UserSearchRequestDTO) {
    return db
      .select()
      .from(UserTable)
      .where(
        and(
          requestDTO.username ? eq(UserTable.username, requestDTO.username) : undefined,
          requestDTO.email ? eq(UserTable.email, requestDTO.email) : undefined,
        ),
      );
  }
}
