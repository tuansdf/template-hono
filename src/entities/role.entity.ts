import { pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const RoleTable = pgTable("_role", {
  ...commonColumns,
  code: text("code").unique(),
  name: text("name"),
  description: text("description"),
  status: text("status"),
});
