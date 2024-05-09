import { JWT_TYPE } from "~/domains/auth/auth.constant.js";
import { UserDTO } from "~/domains/user/user.type.js";
import { JwtTokenClaims } from "~/lib/jwt/jwt.type.js";
import { Nullish } from "~/types/common.type.js";

export type LoginRequestDTO = {
  username: string;
  password: string;
};

export type RegisterRequestDTO = {
  email: string;
  username: string;
  password: string;
};

export type ForgotPasswordRequestDTO = {
  username: string;
};

export type ResetPasswordRequestDTO = {
  password: string;
};

export type AuthJwtTokenPayload = {
  sid?: string | number | Nullish; // user id
  for?: JwtTokenType | Nullish; // token purpose
  pms?: (string | number)[] | Nullish; // permissions
} & JwtTokenClaims;

export type JwtTokenType = (typeof JWT_TYPE)[keyof typeof JWT_TYPE];

export type CreateTokenRequest =
  | {
      type: typeof JWT_TYPE.ACCESS | typeof JWT_TYPE.REFRESH;
      user: UserDTO;
    }
  | {
      type: typeof JWT_TYPE.RESET_PASSWORD | typeof JWT_TYPE.ACTIVATE_ACCOUNT;
      username: string;
    };
