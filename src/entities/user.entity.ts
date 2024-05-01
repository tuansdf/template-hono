import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const UserTable = pgTable("_user", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"),
  status: text("status"),
  tokenNbf: timestamp("token_nbf", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
