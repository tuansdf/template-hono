import { JwtTokenClaims } from "~/lib/jwt/jwt.type.js";

export type LoginRequestDTO = {
  username: string;
  password: string;
};

export type RegisterRequestDTO = {
  email: string;
  username: string;
  password: string;
};

export type JwtAuthTokenPayload = {
  userId?: number | null;
  username?: string | null;
  type?: "auth";
  perms?: number[] | null;
} & JwtTokenClaims;
