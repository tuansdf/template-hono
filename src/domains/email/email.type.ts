import { emails } from "@/db/schemas/email.schema";

export type Email = typeof emails.$inferSelect;
export type EmailDTO = Partial<Email>;
export type EmailSave = typeof emails.$inferInsert;
export type EmailSaveDTO = Partial<EmailSave>;
