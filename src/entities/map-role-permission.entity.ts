import { bigint, bigserial, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const MapRolePermissionTable = pgTable("map_role_permission", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  roleId: bigint("role_id", { mode: "number" }).notNull(),
  permissionId: bigint("permission_id", { mode: "number" }).notNull(),
  status: text("status"),
  ...commonColumns,
});
