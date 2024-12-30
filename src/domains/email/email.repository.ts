import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { EmailDTO, EmailSave } from "@/domains/email/email.type";
import { emailTable } from "@/db/schemas/email.schema";

const selectAll = {
  id: emailTable.id,
  fromEmail: emailTable.fromEmail,
  toEmail: emailTable.toEmail,
  ccEmail: emailTable.ccEmail,
  subject: emailTable.subject,
  content: emailTable.content,
  type: emailTable.type,
  retryCount: emailTable.retryCount,
  status: emailTable.status,
  createdBy: emailTable.createdBy,
  updatedBy: emailTable.updatedBy,
  createdAt: emailTable.createdAt,
  updatedAt: emailTable.updatedAt,
} as const;

class EmailRepository {
  public async findAllByStatus(status: string): Promise<EmailDTO[]> {
    return db.main.select(selectAll).from(emailTable).where(eq(emailTable.status, status));
  }

  public async save(item: EmailSave): Promise<EmailDTO | undefined> {
    const result = await db.main.insert(emailTable).values(item).returning(selectAll);
    return result[0];
  }
}

export const emailRepository = new EmailRepository();
