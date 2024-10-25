import { ENV } from "~/constants/env.constant";
import { JwtTokenType } from "~/domains/auth/auth.type";

export const JWT_TYPE = {
  ACCESS: 1,
  REFRESH: 2,
  RESET_PASSWORD: 3,
  ACTIVATE_ACCOUNT: 4,
} as const;

export const TOKEN_TYPE = {
  JWT: 1,
  JWT_WITH_ID: 2,
};

export const JWT_TYPE_LIFETIME: Readonly<Record<JwtTokenType, number>> = {
  [JWT_TYPE.ACCESS]: ENV.JWT_ACCESS_LIFETIME,
  [JWT_TYPE.REFRESH]: ENV.JWT_REFRESH_LIFETIME,
  [JWT_TYPE.RESET_PASSWORD]: ENV.TOKEN_RESET_PASSWORD_LIFETIME,
  [JWT_TYPE.ACTIVATE_ACCOUNT]: ENV.TOKEN_ACTIVATE_ACCOUNT_LIFETIME,
};
