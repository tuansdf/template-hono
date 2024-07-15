import { SendEmailTable } from "~/entities/send-email.entity";

export type SendEmail = typeof SendEmailTable.$inferSelect;
export type SendEmailDTO = Partial<SendEmail>;
export type SendEmailSave = typeof SendEmailTable.$inferInsert;
export type SendEmailSaveDTO = Partial<SendEmailSave>;
