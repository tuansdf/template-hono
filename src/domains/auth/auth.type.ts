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
  id?: number;
  username?: string | null;
  type?: "auth";
} & JwtTokenClaims;
