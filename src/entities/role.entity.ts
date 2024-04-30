import { bigserial, pgTable, text } from "drizzle-orm/pg-core";

export const RoleTable = pgTable("_role", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code").unique().notNull(),
  name: text("name"),
  description: text("description"),
});
