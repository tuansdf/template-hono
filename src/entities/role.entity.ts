import { bigint, bigserial, pgTable, text } from "drizzle-orm/pg-core";

export const RoleTable = pgTable("_role", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code"),
  b: bigint("b", { mode: "number" }),
});
