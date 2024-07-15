import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

export const commonColumns = {
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .$onUpdateFn(() => sql`now()`),
};
