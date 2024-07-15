import { JWT_TYPE, TOKEN_TYPE } from "~/domains/auth/auth.constant";
import { UserDTO } from "~/domains/user/user.type";
import { JwtTokenClaims } from "~/lib/jwt/jwt.type";

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
  t: string;
  password: string;
  passwordConfirm: string;
};

export type AuthJwtTokenPayload = {
  sid?: string | number | null; // user id
  for?: JwtTokenType | null; // token purpose
  pms?: (string | number)[] | null; // permissions
} & JwtTokenClaims;

export type JwtTokenType = (typeof JWT_TYPE)[keyof typeof JWT_TYPE];
export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

export type CreateTokenRequest =
  | {
      type: typeof JWT_TYPE.ACCESS | typeof JWT_TYPE.REFRESH;
      user: UserDTO;
    }
  | {
      type: typeof JWT_TYPE.RESET_PASSWORD | typeof JWT_TYPE.ACTIVATE_ACCOUNT;
      username: string;
    };
