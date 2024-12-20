import { pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const UserTable = pgTable("_user", {
  username: text("username").unique(),
  email: text("email"),
  password: text("password"),
  name: text("name"),
  status: text("status"),
  ...commonColumns,
});
