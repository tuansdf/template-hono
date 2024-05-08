import { eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { JWT_TYPE } from "~/domains/auth/auth.constant.js";
import {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type.js";
import { AuthUtils } from "~/domains/auth/auth.util.js";
import { PermissionRepository } from "~/domains/permission/permission.repository.js";
import { UserRepository } from "~/domains/user/user.repository.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { UserTable } from "~/entities/user.entity.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { dated } from "~/lib/date/date.js";
import { HashUtils } from "~/lib/hash/hash.util.js";

export class AuthService {
  static login = async (requestDTO: LoginRequestDTO): Promise<UserDTO> => {
    const user = await UserRepository.findTopByUsernameOrEmailWithPassword(requestDTO.username);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const isPasswordMatch = await HashUtils.verify(user.password || "", requestDTO.password);
    if (!isPasswordMatch) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, tokenNbf, ...result } = user;
    const tokenPayload: UserDTO = { ...result, permissions };
    const accessToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.ACCESS });
    const refreshToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.REFRESH });
    return { ...result, accessToken, refreshToken };
  };

  static register = async (requestDTO: RegisterRequestDTO): Promise<UserDTO> => {
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
    const accessToken = await AuthUtils.createToken({ user: saved, type: JWT_TYPE.ACCESS });
    const refreshToken = await AuthUtils.createToken({ user: saved, type: JWT_TYPE.REFRESH });
    return { ...saved, accessToken, refreshToken };
  };

  static refreshToken = async (userId: number, currentTokenIat: number) => {
    const user = await UserRepository.findTopByIdPrivate(userId);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const isTokenInvalidated = currentTokenIat < dated(user.tokenNbf).unix();
    if (isTokenInvalidated) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, tokenNbf, ...result } = user;
    const tokenPayload: UserDTO = { ...result, permissions };
    const accessToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.ACCESS });
    return {
      accessToken,
    };
  };

  static invalidateToken = async (userId: number) => {
    await db.update(UserTable).set({ tokenNbf: dated().toISOString() }).where(eq(UserTable.id, userId));
  };

  static forgotPassword = async (requestDTO: ForgotPasswordRequestDTO) => {
    const user = await UserRepository.findTopByUsernameOrEmail(requestDTO.username);
    if (!user) return;
    const token = await AuthUtils.createToken({ username: requestDTO.username, type: JWT_TYPE.RESET_PASSWORD });
    console.log({ token });
    // TODO: send email
  };

  static resetPassword = async (requestDTO: ResetPasswordRequestDTO, username: string) => {
    const user = await UserRepository.findTopByUsernameOrEmail(username);
    if (!user) {
      throw new CustomException("user.error.not_found", 404);
    }
    const hashedPassword = await HashUtils.hash(requestDTO.password);
    await db
      .update(UserTable)
      .set({ password: hashedPassword, tokenNbf: dated().toISOString() })
      .where(eq(UserTable.id, user.id));
  };
}
