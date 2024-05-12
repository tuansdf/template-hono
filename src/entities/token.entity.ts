import { bigint, bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const TokenTable = pgTable("token", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  foreignId: bigint("foreign_id", { mode: "number" }),
  value: text("value").notNull(),
  type: text("type"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "string",
  }),
  ...commonColumns,
});
