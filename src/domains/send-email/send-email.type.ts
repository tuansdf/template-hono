import { SendEmailTable } from "~/entities/send-email.entity";

export type SendEmail = typeof SendEmailTable.$inferSelect;
export type SendEmailSave = typeof SendEmailTable.$inferInsert;
