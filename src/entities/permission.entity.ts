import { bigserial, pgTable, text } from "drizzle-orm/pg-core";

export const PermissionTable = pgTable("_permission", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code").unique().notNull(),
  name: text("name"),
  description: text("description"),
});
