import { bigserial, pgTable, text } from "drizzle-orm/pg-core";
import { STATUS } from "~/constants/status.constant";
import { commonColumns } from "~/entities/common.entity";

export const RoleTable = pgTable("_role", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code").unique().notNull(),
  name: text("name"),
  description: text("description"),
  status: text("status").default(STATUS.ACTIVE),
  ...commonColumns,
});
