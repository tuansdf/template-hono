import { ilike, or } from "drizzle-orm";
import { db } from "~/database/db.js";
import { userCommonSelect, UserRepository } from "~/domains/user/user.repository.js";
import { UserSearchRequestDTO } from "~/domains/user/user.type.js";
import { UserTable } from "~/entities/user.entity.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export class UserService {
  static async findOneById(userId: number) {
    const user = await UserRepository.findTopById(userId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    return user;
  }

  static async findOneByUsername(username: string) {
    const user = await UserRepository.findTopByUsername(username);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    return user;
  }

  static async findOneByEmail(email: string) {
    const user = await UserRepository.findTopByEmail(email);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    return user;
  }

  static async findAll() {
    return UserRepository.findAll();
  }

  static async search(requestDTO: UserSearchRequestDTO) {
    const query = db.select(userCommonSelect).from(UserTable);
    if (requestDTO.q) {
      query.where(or(ilike(UserTable.email, `%${requestDTO.q}%`), ilike(UserTable.username, `%${requestDTO.q}%`)));
    }
    if (requestDTO.pageSize && requestDTO.pageNumber) {
      query.limit(requestDTO.pageSize).offset((requestDTO.pageNumber - 1) * requestDTO.pageSize);
    }
    return query.execute();
  }
}
