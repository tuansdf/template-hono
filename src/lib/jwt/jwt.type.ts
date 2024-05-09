import { Nullish } from "~/types/common.type";

export type JwtTokenPayload = Record<string, unknown> & JwtTokenClaims;

export type JwtTokenClaims = {
  iss?: string | number | Nullish;
  sub?: string | number | Nullish;
  aud?: string | number | Nullish;
  exp?: number | Nullish;
  nbf?: number | Nullish;
  iat?: number | Nullish;
  jti?: string | number | Nullish;
};
