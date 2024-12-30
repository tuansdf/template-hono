import { JWTPayload } from "jose";
import { JWT_TYPE } from "@/domains/token/token.constant";
import { tokenTable } from "@/db/schemas/token.schema";

export type Token = typeof tokenTable.$inferSelect;
export type TokenDTO = Partial<Token>;
export type TokenSave = typeof tokenTable.$inferInsert;
export type TokenSaveDTO = Partial<TokenSave>;

export type AuthJwtTokenPayload = {
  sid?: string | null; // user id
  for?: JwtTokenType | null; // token purpose
  pms?: (string | number)[] | null; // permissions
  tid?: string | null; // token id
} & JWTPayload;

export type JwtTokenType = (typeof JWT_TYPE)[keyof typeof JWT_TYPE];
