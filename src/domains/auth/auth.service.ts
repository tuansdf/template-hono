import { eq } from "drizzle-orm";
import { STATUS } from "~/constants/status.constant";
import { db } from "~/db/db";
import {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type";
import { emailService } from "~/domains/email/email.service";
import { permissionRepository } from "~/domains/permission/permission.repository";
import { permissionUtils } from "~/domains/permission/permission.util";
import { jwtService } from "~/domains/token/jwt.service";
import { JWT_TYPE } from "~/domains/token/token.constant";
import { tokenService } from "~/domains/token/token.service";
import { userRepository } from "~/domains/user/user.repository";
import { UserDTO } from "~/domains/user/user.type";
import { TokenTable } from "~/entities/token.entity";
import { UserTable } from "~/entities/user.entity";
import { CustomException } from "~/exceptions/custom-exception";
import { hasher } from "~/lib/hasher";
import { TFn } from "~/lib/i18n";
import { logger } from "~/lib/logger";

class AuthService {
  public async login(requestDTO: LoginRequestDTO): Promise<UserDTO> {
    const user = await userRepository.findTopByUsernameOrEmailWithPassword(requestDTO.username);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const isPasswordMatch = await hasher.verify(String(user.password), requestDTO.password);
    if (!isPasswordMatch) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    if (user.status !== STATUS.ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
    }
    const permissions = await permissionRepository.findAllByUserId(user.id || "");
    delete user.password;
    const accessToken = await jwtService.createToken(
      await jwtService.createAccessTokenPayload(
        user.id || "",
        permissionUtils.codesToIndexes(permissions?.map((x) => x.code!) || []),
      ),
    );
    const refreshToken = await tokenService.createRefreshToken({ userId: user.id! });
    return { ...user, accessToken, refreshToken: refreshToken?.value };
  }

  public async register(requestDTO: RegisterRequestDTO, t: TFn) {
    const existUserWithUsername = await userRepository.existByUsername(requestDTO.username);
    if (existUserWithUsername) {
      throw new CustomException("dynamic.error.not_available;field.username", 409);
    }
    const existUserWithEmail = await userRepository.existByEmail(requestDTO.email);
    if (existUserWithEmail) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#account-creation
      logger.error("Register with existing email");
      return;
    }
    requestDTO.password = await hasher.hash(requestDTO.password);
    const saved = await userRepository.save({ ...requestDTO, status: STATUS.PENDING });
    if (!saved) {
      throw new CustomException();
    }
    const token = await tokenService.createActivateAccountToken({ userUsername: saved.username!, userId: saved.id! });
    await emailService.sendActivateAccountEmail({
      userEmail: saved.email!,
      userUsername: saved.username!,
      token: token?.value!,
      t,
    });
  }

  public async refreshToken(userId: string, tokenId: string) {
    const token = await tokenService.verifyById(tokenId);
    if (!token) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const user = await userRepository.findTopById(userId);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    if (user.status !== STATUS.ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
    }
    const permissions = await permissionRepository.findAllByUserId(user.id || "");
    const accessToken = await jwtService.createAccessTokenPayload(
      user.id || "",
      permissionUtils.codesToIndexes(permissions?.map((x) => x.code!) || []),
    );
    return {
      accessToken,
    };
  }

  public async forgotPassword(requestDTO: ForgotPasswordRequestDTO, t: TFn) {
    const user = await userRepository.findTopByUsernameOrEmail(requestDTO.username);
    if (!user) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#password-recovery
      logger.error("Request password recovery with not registered email");
      return;
    }
    const token = await tokenService.createResetPasswordToken({ userId: user.id!, userUsername: user.username! });
    await emailService.sendResetPasswordEmail({
      userEmail: user.email!,
      userUsername: user.username!,
      token: token?.value!,
      t,
    });
  }

  public async resetPassword(requestDTO: ResetPasswordRequestDTO) {
    const tokenValue = requestDTO.t;
    const token = await tokenService.findOneById(tokenValue);
    if (!token || !token.foreignId || token.status !== STATUS.ACTIVE) {
      throw new CustomException("auth.error.token_used_or_invalid", 401);
    }
    try {
      await jwtService.verifyToken(token.value || "", JWT_TYPE.RESET_PASSWORD);
    } catch {
      throw new CustomException("auth.error.token_used_or_invalid");
    }
    const user = await userRepository.findTopById(token.foreignId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found;field.user", 404);
    }
    const hashedPassword = await hasher.hash(requestDTO.password);
    await db.main
      .update(TokenTable)
      .set({ status: STATUS.INACTIVE })
      .where(eq(TokenTable.id, token.id || ""));
    await db.main
      .update(UserTable)
      .set({ password: hashedPassword })
      .where(eq(UserTable.id, user.id || ""));
  }

  public async activateAccount(tokenValue: string) {
    const token = await tokenService.findOneById(tokenValue);
    if (!token || !token.foreignId || token.status !== STATUS.ACTIVE) {
      throw new CustomException("auth.error.token_used_or_invalid", 401);
    }
    try {
      await jwtService.verifyToken(token.value || "", JWT_TYPE.ACTIVATE_ACCOUNT);
    } catch {
      throw new CustomException("auth.error.token_used_or_invalid");
    }
    const user = await userRepository.findTopById(token.foreignId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found;field.user", 404);
    }
    if (user.status === STATUS.ACTIVE) {
      throw new CustomException("auth.error.already_activated", 400);
    }
    await db.main
      .update(TokenTable)
      .set({ status: STATUS.INACTIVE })
      .where(eq(TokenTable.id, token.id || ""));
    await db.main
      .update(UserTable)
      .set({ status: STATUS.ACTIVE })
      .where(eq(UserTable.id, user.id || ""));
  }
}

export const authService = new AuthService();
