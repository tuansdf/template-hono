import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "@/db/schemas/common.schema";

export const rolePermissions = pgTable("role_permission", {
  ...commonColumns,
  roleId: uuid("role_id").notNull(),
  permissionId: uuid("permission_id").notNull(),
  status: text("status"),
});
