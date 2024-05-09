import { bigint, bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const SendNotificationTable = pgTable("send_notification", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  fromUserId: bigint("from_user_id", { mode: "number" }),
  toUserId: bigint("from_user_id", { mode: "number" }),
  title: text("title"),
  content: text("content"),
  data: text("data"),
  type: text("type"),
  topic: text("topic"),
  navigateTo: text("navigate_to"),
  retryCount: integer("retry_count"),
  ...commonColumns,
});
