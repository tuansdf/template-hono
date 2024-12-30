import { emailTable } from "@/db/schemas/email.schema";

export type Email = typeof emailTable.$inferSelect;
export type EmailDTO = Partial<Email>;
export type EmailSave = typeof emailTable.$inferInsert;
export type EmailSaveDTO = Partial<EmailSave>;
