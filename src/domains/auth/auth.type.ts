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

export type JwtAuthTokenType = "access" | "refresh";

export type JwtAuthTokenPayload = {
  userId?: number | Nullish;
  username?: string | Nullish;
  type?: JwtAuthTokenType;
  perms?: number[] | Nullish;
} & JwtTokenClaims;
