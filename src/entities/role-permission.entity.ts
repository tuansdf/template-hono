import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const RolePermissionTable = pgTable("role_permission", {
  ...commonColumns,
  roleId: uuid("role_id").notNull(),
  permissionId: uuid("permission_id").notNull(),
  status: text("status"),
});
