import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "@/db/schemas/common.schema";

export const tokenTable = pgTable("token", {
  ...commonColumns,
  foreignId: uuid("foreign_id"),
  value: text("value"),
  type: text("type"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  status: text("status"),
});
