import { LoginRequestDTO, RegisterRequestDTO } from "~/domains/auth/auth.type.js";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { PermissionRepository } from "~/domains/permission/permission.repository.js";
import { UserRepository } from "~/domains/user/user.repository.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { HashUtils } from "~/lib/hash/hash.util.js";

export class AuthService {
  static async login(requestDTO: LoginRequestDTO) {
    const user = await UserRepository.findTopByUsernameOrEmailWithPassword(requestDTO.username);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const isPasswordMatch = await HashUtils.verify(user.password || "", requestDTO.password);
    if (!isPasswordMatch) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, ...userWithoutPassword } = user;
    const tokenPayload: UserDTO = { ...userWithoutPassword, permissions };
    const token = await AuthUtils.createToken(tokenPayload);
    const { permissions: _, ...result } = tokenPayload;
    return { ...result, token };
  }

  static async register(requestDTO: RegisterRequestDTO) {
    const existUserWithUsername = await UserRepository.existByUsername(requestDTO.username);
    if (existUserWithUsername) {
      throw new CustomException("auth.error.duplicated_username", 409);
    }
    const existUserWithEmail = await UserRepository.existByEmail(requestDTO.email);
    if (existUserWithEmail) {
      throw new CustomException("auth.error.duplicated_email", 409);
    }
    requestDTO.password = await HashUtils.hash(requestDTO.password);
    const saved = await UserRepository.save(requestDTO);
    const permissions = await PermissionRepository.findAllByUserId(saved.id);
    const result: UserDTO = { ...saved, permissions };
    const token = await AuthUtils.createToken(result);
    return { ...result, token };
  }
}
