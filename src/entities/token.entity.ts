import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const TokenTable = pgTable("token", {
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
