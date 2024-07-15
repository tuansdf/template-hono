import { TokenTable } from "~/entities/token.entity";

export type Token = typeof TokenTable.$inferSelect;
export type TokenDTO = Partial<Token>;
export type TokenSave = typeof TokenTable.$inferInsert;
export type TokenSaveDTO = Partial<TokenSave>;

export type TokenValueWithId = {
  v?: string; // value
  i?: number; // id
};
