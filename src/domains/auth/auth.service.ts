import { eq } from "drizzle-orm";
import { STATUS_ACTIVE, STATUS_PENDING } from "~/constants/status.constant.js";
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
import { logger } from "~/lib/logger/logger.js";

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
    if (user.status !== STATUS_ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, tokenNbf, ...result } = user;
    const tokenPayload: UserDTO = { ...result, permissions };
    const accessToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.ACCESS });
    const refreshToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.REFRESH });
    return { ...result, accessToken, refreshToken };
  };

  static register = async (requestDTO: RegisterRequestDTO) => {
    const existUserWithUsername = await UserRepository.existByUsername(requestDTO.username);
    if (existUserWithUsername) {
      throw new CustomException("dynamic.error.not_available:::field.username", 409);
    }
    const existUserWithEmail = await UserRepository.existByEmail(requestDTO.email);
    if (existUserWithEmail) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#account-creation
      logger.error("Register with registered email");
      return;
    }
    requestDTO.password = await HashUtils.hash(requestDTO.password);
    await UserRepository.save({ ...requestDTO, status: STATUS_PENDING });
    const token = await AuthUtils.createToken({ username: requestDTO.email, type: JWT_TYPE.ACTIVATE_ACCOUNT });
    console.log({ token });
    // TODO: send email
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
    if (user.status !== STATUS_ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
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
    if (!user) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#password-recovery
      logger.error("Request password recovery with not registered email");
      return;
    }
    const token = await AuthUtils.createToken({ username: requestDTO.username, type: JWT_TYPE.RESET_PASSWORD });
    console.log({ token });
    // TODO: send email
  };

  static resetPassword = async (requestDTO: ResetPasswordRequestDTO, username: string) => {
    const user = await UserRepository.findTopByUsernameOrEmail(username);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    const hashedPassword = await HashUtils.hash(requestDTO.password);
    await db
      .update(UserTable)
      .set({ password: hashedPassword, tokenNbf: dated().toISOString() })
      .where(eq(UserTable.id, user.id));
  };

  static activateAccount = async (username: string) => {
    const user = await UserRepository.findTopByUsernameOrEmail(username);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    if (user.status === STATUS_ACTIVE) {
      throw new CustomException("auth.error.already_activated", 400);
    }
    await db
      .update(UserTable)
      .set({ status: STATUS_ACTIVE, tokenNbf: dated().toISOString() })
      .where(eq(UserTable.id, user.id));
  };
}
