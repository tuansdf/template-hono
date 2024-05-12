import { TokenTable } from "~/entities/token.entity";

export type Token = typeof TokenTable.$inferSelect;
export type TokenSave = typeof TokenTable.$inferInsert;
