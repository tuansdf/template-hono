import { JwtTokenClaims, JwtTokenType } from "~/lib/jwt/jwt.type.js";
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

export type AuthJwtTokenPayload = {
  userId?: number | Nullish;
  username?: string | Nullish;
  type?: JwtTokenType | Nullish;
  perms?: number[] | Nullish;
} & JwtTokenClaims;
