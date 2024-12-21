import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const NotificationTable = pgTable("notification", {
  ...commonColumns,
  fromUserId: uuid("from_user_id"),
  toUserId: uuid("from_user_id"),
  title: text("title"),
  content: text("content"),
  data: text("data"),
  type: text("type"),
  topic: text("topic"),
  navigateTo: text("navigate_to"),
  retryCount: integer("retry_count"),
  status: text("status"),
});
