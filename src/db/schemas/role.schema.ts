import { pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "@/db/schemas/common.schema";

export const roleTable = pgTable("_role", {
  ...commonColumns,
  code: text("code").unique(),
  name: text("name"),
  description: text("description"),
  status: text("status"),
});
