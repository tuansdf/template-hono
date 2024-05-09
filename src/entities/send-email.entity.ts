import { bigserial, integer, pgTable, text } from "drizzle-orm/pg-core";
import { commonColumns } from "~/entities/common.entity";

export const SendEmailTable = pgTable("send_email", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  fromEmail: text("from_email"),
  toEmail: text("to_email"),
  ccEmail: text("cc_email"),
  subject: text("subject"),
  content: text("content"),
  usageCode: text("usage_code"),
  retryCount: integer("retry_count"),
  ...commonColumns,
});
