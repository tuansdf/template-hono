import { bigint, bigserial, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const MapUserRoleTable = pgTable("map_user_role", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  roleId: bigint("role_id", { mode: "number" }).notNull(),
  status: text("status"),
  ...commonColumns,
});
