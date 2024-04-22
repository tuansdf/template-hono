import { bigint, bigserial, pgTable, text } from "drizzle-orm/pg-core";

export const PermissionTable = pgTable("_permission", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code"),
  b: bigint("b", { mode: "number" }),
});
