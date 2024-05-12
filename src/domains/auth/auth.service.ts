import { eq } from "drizzle-orm";
import {
  ENV_EMAIL_ACTIVATE_ACCOUNT_BASE_URL,
  ENV_EMAIL_RESET_PASSWORD_BASE_URL,
  ENV_JWT_REFRESH_LIFETIME,
  ENV_TOKEN_ACTIVATE_ACCOUNT_LIFETIME,
  ENV_TOKEN_RESET_PASSWORD_LIFETIME,
} from "~/constants/env.constant";
import { STATUS } from "~/constants/status.constant";
import { TYPE } from "~/constants/type.constant";
import { db } from "~/database/db";
import { JWT_TYPE } from "~/domains/auth/auth.constant";
import {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type";
import { AuthUtils } from "~/domains/auth/auth.util";
import { PermissionRepository } from "~/domains/permission/permission.repository";
import { SendEmailService } from "~/domains/send-email/send-email.service";
import { SendEmailSave } from "~/domains/send-email/send-email.type";
import { TokenRepository } from "~/domains/token/token.repository";
import { TokenService } from "~/domains/token/token.service";
import { TokenSave } from "~/domains/token/token.type";
import { UserRepository } from "~/domains/user/user.repository";
import { User, UserDTO } from "~/domains/user/user.type";
import { TokenTable } from "~/entities/token.entity";
import { UserTable } from "~/entities/user.entity";
import { CustomException } from "~/exceptions/custom-exception";
import { TFn } from "~/i18n/i18n.type";
import { Base64Utils } from "~/lib/base64/base64.util";
import { dated } from "~/lib/date/date";
import { HashUtils } from "~/lib/hash/hash.util";
import { logger } from "~/lib/logger/logger";

export class AuthService {
  static login = async (requestDTO: LoginRequestDTO): Promise<UserDTO> => {
    const user = await UserRepository.findTopByUsernameOrEmailWithPassword(requestDTO.username);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const isPasswordMatch = await HashUtils.verify(String(user.password), requestDTO.password);
    if (!isPasswordMatch) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    if (user.status !== STATUS.ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, ...result } = user;
    const tokenPayload: UserDTO = { ...result, permissions };
    const accessToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.ACCESS });
    const refreshToken = await _AuthService.createRefreshToken(user);
    return { ...result, accessToken, refreshToken: refreshToken.value };
  };

  static register = async (requestDTO: RegisterRequestDTO, t: TFn) => {
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
    const saved = await UserRepository.save({ ...requestDTO, status: STATUS.PENDING });
    const token = await _AuthService.createActivateAccountToken(saved);
    await _AuthService.sendActivateAccountEmail(saved, token.value, t);
  };

  static refreshToken = async (userId: number, tokenValue: string) => {
    const token = await TokenRepository.findTopByValueAndForeignIdAndStatus(tokenValue, userId, STATUS.ACTIVE);
    if (!token) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    const user = await UserRepository.findTopById(userId);
    if (!user) {
      throw new CustomException("auth.error.unauthenticated", 401);
    }
    if (user.status !== STATUS.ACTIVE) {
      throw new CustomException("user.error.not_activated", 401);
    }
    const permissions = await PermissionRepository.findAllByUserId(user.id);
    const { password, ...result } = user;
    const tokenPayload: UserDTO = { ...result, permissions };
    const accessToken = await AuthUtils.createToken({ user: tokenPayload, type: JWT_TYPE.ACCESS });
    return {
      accessToken,
    };
  };

  static forgotPassword = async (requestDTO: ForgotPasswordRequestDTO, t: TFn) => {
    const user = await UserRepository.findTopByUsernameOrEmail(requestDTO.username);
    if (!user) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#password-recovery
      logger.error("Request password recovery with not registered email");
      return;
    }
    const token = await _AuthService.createResetPasswordToken(user);
    await _AuthService.sendResetPasswordEmail(user, token.value, t);
  };

  static resetPassword = async (requestDTO: ResetPasswordRequestDTO) => {
    const tokenValue = requestDTO.t;
    try {
      await AuthUtils.verifyToken(Base64Utils.decode(tokenValue), JWT_TYPE.RESET_PASSWORD);
    } catch (e) {
      throw new CustomException("auth.error.token_used_or_invalid");
    }
    const token = await TokenRepository.findTopByValueAndStatus(tokenValue, STATUS.ACTIVE);
    if (!token || !token.foreignId || token.status !== STATUS.ACTIVE) {
      throw new CustomException("auth.error.token_used_or_invalid", 401);
    }
    const user = await UserRepository.findTopById(token.foreignId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    const hashedPassword = await HashUtils.hash(requestDTO.password);
    await db.update(TokenTable).set({ status: STATUS.INACTIVE }).where(eq(TokenTable.id, token.id));
    await db.update(UserTable).set({ password: hashedPassword }).where(eq(UserTable.id, user.id));
  };

  static activateAccount = async (tokenValue: string) => {
    try {
      await AuthUtils.verifyToken(Base64Utils.decode(tokenValue), JWT_TYPE.ACTIVATE_ACCOUNT);
    } catch (e) {
      throw new CustomException("auth.error.token_used_or_invalid");
    }
    const token = await TokenRepository.findTopByValueAndStatus(tokenValue, STATUS.ACTIVE);
    if (!token || !token.foreignId || token.status !== STATUS.ACTIVE) {
      throw new CustomException("auth.error.token_used_or_invalid", 401);
    }
    const user = await UserRepository.findTopById(token.foreignId);
    if (!user) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    if (user.status === STATUS.ACTIVE) {
      throw new CustomException("auth.error.already_activated", 400);
    }
    await db.update(TokenTable).set({ status: STATUS.INACTIVE }).where(eq(TokenTable.id, token.id));
    await db.update(UserTable).set({ status: STATUS.ACTIVE }).where(eq(UserTable.id, user.id));
  };
}

class _AuthService {
  static sendResetPasswordEmail = async (user: User, token: string, t: TFn) => {
    const item: SendEmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: user.email,
      type: TYPE.RESET_PASSWORD,
      subject: t("auth.message.reset_password_email_subject"),
      content: t("auth.message.reset_password_email_content", {
        1: user.email,
        2: ENV_EMAIL_RESET_PASSWORD_BASE_URL + token,
      }),
    };
    await SendEmailService.send(item);
  };
  static sendActivateAccountEmail = async (user: User, token: string, t: TFn) => {
    const item: SendEmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: user.email,
      type: TYPE.ACTIVATE_ACCOUNT,
      subject: t("auth.message.activate_account_email_subject"),
      content: t("auth.message.activate_account_email_content", {
        1: user.email,
        2: ENV_EMAIL_ACTIVATE_ACCOUNT_BASE_URL + token,
      }),
    };
    await SendEmailService.send(item);
  };
  static createActivateAccountToken = async (user: User) => {
    const tokenValue = Base64Utils.encode(
      await AuthUtils.createToken({ type: JWT_TYPE.ACTIVATE_ACCOUNT, username: user.username }),
    );
    const expiresAt = dated().add(ENV_TOKEN_ACTIVATE_ACCOUNT_LIFETIME, "minute").toISOString();
    const item: TokenSave = {
      foreignId: user.id,
      value: tokenValue,
      type: TYPE.ACTIVATE_ACCOUNT,
      expiresAt,
      status: STATUS.ACTIVE,
    };
    return TokenService.save(item);
  };
  static createResetPasswordToken = async (user: User) => {
    const tokenValue = Base64Utils.encode(
      await AuthUtils.createToken({ type: JWT_TYPE.RESET_PASSWORD, username: user.username }),
    );
    const expiresAt = dated().add(ENV_TOKEN_RESET_PASSWORD_LIFETIME, "minute").toISOString();
    const item: TokenSave = {
      foreignId: user.id,
      value: tokenValue,
      type: TYPE.RESET_PASSWORD,
      expiresAt,
      status: STATUS.ACTIVE,
    };
    return TokenService.save(item);
  };
  static createRefreshToken = async (user: User) => {
    const tokenValue = await AuthUtils.createToken({ type: JWT_TYPE.REFRESH, user });
    const expiresAt = dated().add(ENV_JWT_REFRESH_LIFETIME, "minute").toISOString();
    const item: TokenSave = {
      foreignId: user.id,
      value: tokenValue,
      type: TYPE.REFRESH_TOKEN,
      expiresAt,
      status: STATUS.ACTIVE,
    };
    return TokenService.save(item);
  };
}
