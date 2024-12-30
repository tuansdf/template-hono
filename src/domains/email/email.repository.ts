import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { EmailDTO, EmailSave } from "@/domains/email/email.type";
import { emails } from "@/db/schemas/email.schema";

const selectAll = {
  id: emails.id,
  fromEmail: emails.fromEmail,
  toEmail: emails.toEmail,
  ccEmail: emails.ccEmail,
  subject: emails.subject,
  content: emails.content,
  type: emails.type,
  retryCount: emails.retryCount,
  status: emails.status,
  createdBy: emails.createdBy,
  updatedBy: emails.updatedBy,
  createdAt: emails.createdAt,
  updatedAt: emails.updatedAt,
} as const;

class EmailRepository {
  public async findAllByStatus(status: string): Promise<EmailDTO[]> {
    return db.main.select(selectAll).from(emails).where(eq(emails.status, status));
  }

  public async save(item: EmailSave): Promise<EmailDTO | undefined> {
    const result = await db.main.insert(emails).values(item).returning(selectAll);
    return result[0];
  }
}

export const emailRepository = new EmailRepository();
