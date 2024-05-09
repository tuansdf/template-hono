import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const UserTable = pgTable("_user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"),
  name: text("name"),
  tokenNbf: timestamp("token_nbf", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  ...commonColumns,
});
