import { eq } from "drizzle-orm";
import { db } from "~/database/db";
import { SendEmailSave } from "~/domains/send-email/send-email.type";
import { SendEmailTable } from "~/entities/send-email.entity";

export class SendEmailRepository {
  static findAllByStatus = async (status: string) => {
    return db.main.select().from(SendEmailTable).where(eq(SendEmailTable.status, status));
  };

  static save = async (item: SendEmailSave) => {
    await db.main.insert(SendEmailTable).values(item);
  };
}
