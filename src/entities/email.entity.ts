import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const EmailTable = pgTable("email", {
  ...commonColumns,
  fromEmail: text("from_email"),
  toEmail: text("to_email"),
  ccEmail: text("cc_email"),
  subject: text("subject"),
  content: text("content"),
  type: text("type"),
  retryCount: integer("retry_count"),
  status: text("status"),
});
