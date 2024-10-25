import { eq } from "drizzle-orm";
import { db } from "~/database/db";
import { EmailDTO, EmailSave } from "~/domains/email/email.type";
import { EmailTable } from "~/entities/email.entity";

const selectAll = {
  id: EmailTable.id,
  fromEmail: EmailTable.fromEmail,
  toEmail: EmailTable.toEmail,
  ccEmail: EmailTable.ccEmail,
  subject: EmailTable.subject,
  content: EmailTable.content,
  type: EmailTable.type,
  retryCount: EmailTable.retryCount,
  status: EmailTable.status,
  createdBy: EmailTable.createdBy,
  updatedBy: EmailTable.updatedBy,
  createdAt: EmailTable.createdAt,
  updatedAt: EmailTable.updatedAt,
} as const;

class EmailRepository {
  public async findAllByStatus(status: string): Promise<EmailDTO[]> {
    return db.main.select(selectAll).from(EmailTable).where(eq(EmailTable.status, status));
  }

  public async save(item: EmailSave): Promise<EmailDTO | undefined> {
    const result = await db.main.insert(EmailTable).values(item).returning(selectAll);
    return result[0];
  }
}

export const emailRepository = new EmailRepository();
