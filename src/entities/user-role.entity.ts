import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const UserRoleTable = pgTable("user_role", {
  userId: uuid("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
  status: text("status"),
  ...commonColumns,
});
