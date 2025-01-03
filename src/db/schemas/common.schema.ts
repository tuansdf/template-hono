import { timestamp, uuid } from "drizzle-orm/pg-core";
import { uuid as generateUUID } from "@/lib/uuid";

export const commonColumns = {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    precision: 3,
    mode: "date",
  })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};
