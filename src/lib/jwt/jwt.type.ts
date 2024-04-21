export type JwtTokenPayload = Record<string, unknown>;

export type JwtTokenClaims = {
  iss?: string | number;
  sub?: string | number;
  aud?: string | number;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string | number;
};
