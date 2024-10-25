import { JWTPayload } from "jose";
import { JWT_TYPE } from "~/domains/token/token.constant";

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
  tid?: string | number | null; // token id
} & JWTPayload;

export type JwtTokenType = (typeof JWT_TYPE)[keyof typeof JWT_TYPE];
