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
  sid?: number | Nullish; // user id
  for?: JwtTokenType | Nullish; // token purpose
  pms?: number[] | Nullish; // permissions
} & JwtTokenClaims;
