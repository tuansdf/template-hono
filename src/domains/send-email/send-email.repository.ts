import { eq } from "drizzle-orm";
import { db } from "~/database/db";
import { SendEmailSave } from "~/domains/send-email/send-email.type";
import { SendEmailTable } from "~/entities/send-email.entity";

const selectAll = {
  id: SendEmailTable.id,
  fromEmail: SendEmailTable.fromEmail,
  toEmail: SendEmailTable.toEmail,
  ccEmail: SendEmailTable.ccEmail,
  subject: SendEmailTable.subject,
  content: SendEmailTable.content,
  type: SendEmailTable.type,
  retryCount: SendEmailTable.retryCount,
  status: SendEmailTable.status,
  createdBy: SendEmailTable.createdBy,
  updatedBy: SendEmailTable.updatedBy,
  createdAt: SendEmailTable.createdAt,
  updatedAt: SendEmailTable.updatedAt,
} as const;

class SendEmailRepository {
  public findAllByStatus = async (status: string) => {
    return db.main.select(selectAll).from(SendEmailTable).where(eq(SendEmailTable.status, status));
  };

  public save = async (item: SendEmailSave) => {
    await db.main.insert(SendEmailTable).values(item).returning(selectAll);
  };
}

export const sendEmailRepository = new SendEmailRepository();
