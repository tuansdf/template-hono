import { eq } from "drizzle-orm";
import { ENV_EMAIL_ACTIVATE_ACCOUNT_BASE_URL } from "~/constants/env.constant";
import { STATUS_ACTIVE, STATUS_PENDING } from "~/constants/status.constant";
import { db } from "~/database/db";
import { JWT_TYPE } from "~/domains/auth/auth.constant";
import {
  AuthJwtTokenPayload,
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type";
import { AuthUtils } from "~/domains/auth/auth.util";
import { PermissionRepository } from "~/domains/permission/permission.repository";
import {
  EMAIL_USAGE_CODE_ACTIVATE_ACCOUNT,
  EMAIL_USAGE_CODE_RESET_PASSWORD,
} from "~/domains/send-email/send-email.constant";
import { SendEmailService } from "~/domains/send-email/send-email.service";
import { SendEmailSave } from "~/domains/send-email/send-email.type";
import { UserRepository } from "~/domains/user/user.repository";
import { User, UserDTO } from "~/domains/user/user.type";
import { UserTable } from "~/entities/user.entity";
import { CustomException } from "~/exceptions/custom-exception";
import { TFn } from "~/i18n/i18n.type";
import { dated } from "~/lib/date/date";
import { HashUtils } from "~/lib/hash/hash.util";
import { logger } from "~/lib/logger/logger";

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
    const saved = await UserRepository.save({ ...requestDTO, status: STATUS_PENDING });
    const token = await AuthUtils.createToken({ username: requestDTO.email, type: JWT_TYPE.ACTIVATE_ACCOUNT });
    await _AuthService.sendForgotPasswordEmail(saved, token, t);
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

  static forgotPassword = async (requestDTO: ForgotPasswordRequestDTO, t: TFn) => {
    const user = await UserRepository.findTopByUsernameOrEmail(requestDTO.username);
    if (!user) {
      // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#password-recovery
      logger.error("Request password recovery with not registered email");
      return;
    }
    const token = await AuthUtils.createToken({ username: requestDTO.username, type: JWT_TYPE.RESET_PASSWORD });
    await _AuthService.sendForgotPasswordEmail(user, token, t);
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

  static activateAccount = async (token: string) => {
    let payload: AuthJwtTokenPayload;
    try {
      payload = await AuthUtils.verifyToken(token, JWT_TYPE.ACTIVATE_ACCOUNT);
    } catch (e) {
      throw new CustomException("auth.message.activate_account_failed", 404);
    }
    const username = payload.sub;
    if (!username) {
      throw new CustomException("dynamic.error.not_found:::field.user", 404);
    }
    const user = await UserRepository.findTopByUsernameOrEmail(String(username));
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

class _AuthService {
  static sendForgotPasswordEmail = async (user: User, token: string, t: TFn) => {
    const item: SendEmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: user.email,
      usageCode: EMAIL_USAGE_CODE_RESET_PASSWORD,
      subject: t("auth.message.forgot_password_email_subject"),
      content: t("auth.message.forgot_password_email_content", {
        1: user.email,
        2: ENV_EMAIL_ACTIVATE_ACCOUNT_BASE_URL + token,
      }),
    };
    await SendEmailService.send(item);
  };
  static sendActivateAccountEmail = async (user: User, token: string, t: TFn) => {
    const item: SendEmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: user.email,
      usageCode: EMAIL_USAGE_CODE_ACTIVATE_ACCOUNT,
      subject: t("auth.message.activate_account_email_subject"),
      content: t("auth.message.activate_account_email_content", { 1: user.email, 2: token }),
    };
    await SendEmailService.send(item);
  };
}
