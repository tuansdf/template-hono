import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "@/db/schemas/common.schema";

export const userRoles = pgTable("user_role", {
  ...commonColumns,
  userId: uuid("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
  status: text("status"),
});
