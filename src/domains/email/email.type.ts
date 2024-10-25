import { EmailTable } from "~/entities/email.entity";

export type Email = typeof EmailTable.$inferSelect;
export type EmailDTO = Partial<Email>;
export type EmailSave = typeof EmailTable.$inferInsert;
export type EmailSaveDTO = Partial<EmailSave>;
