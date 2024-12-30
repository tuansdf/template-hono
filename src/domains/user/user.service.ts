import { ilike, or } from "drizzle-orm";
import { STATUS } from "@/constants/status.constant";
import { db } from "@/db/db";
import { userRepository, userSelector } from "@/domains/user/user.repository";
import { UserSearchRequestDTO } from "@/domains/user/user.type";
import { userTable } from "@/db/schemas/user.schema";
import { CustomException } from "@/exceptions/custom-exception";

class UserService {
  public async findOneById(userId: string) {
    const user = await userRepository.findTopById(userId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found;field.user", 404);
    }
    return user;
  }

  public async findOneByUsername(username: string) {
    const user = await userRepository.findTopByUsername(username);
    if (!user) {
      throw new CustomException("dynamic.error.not_found;field.user", 404);
    }
    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await userRepository.findTopByEmail(email);
    if (!user) {
      throw new CustomException("dynamic.error.not_found;field.user", 404);
    }
    return user;
  }

  public async findAll() {
    return userRepository.findAllByStatus(STATUS.ACTIVE);
  }

  public async search(requestDTO: UserSearchRequestDTO) {
    const query = db.main.select(userSelector.search).from(userTable);
    if (requestDTO.q) {
      query.where(or(ilike(userTable.email, `%${requestDTO.q}%`), ilike(userTable.username, `%${requestDTO.q}%`)));
    }
    if (requestDTO.pageSize && requestDTO.pageNumber) {
      query.limit(requestDTO.pageSize).offset((requestDTO.pageNumber - 1) * requestDTO.pageSize);
    }
    return query.execute();
  }

  public async checkExist(username: string) {
    return userRepository.existByUsername(username);
  }
}

export const userService = new UserService();
