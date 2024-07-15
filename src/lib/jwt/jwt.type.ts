export type JwtTokenPayload = Record<string, unknown>;

export type JwtTokenClaims = {
  iss?: string | number | null;
  sub?: string | number | null;
  aud?: string | number | null;
  exp?: number | null;
  nbf?: number | null;
  iat?: number | null;
  jti?: string | number | null;
};
