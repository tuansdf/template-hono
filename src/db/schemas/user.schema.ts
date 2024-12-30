import { pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "@/db/schemas/common.schema";

export const userTable = pgTable("_user", {
  ...commonColumns,
  username: text("username").unique(),
  email: text("email"),
  password: text("password"),
  name: text("name"),
  status: text("status"),
});
