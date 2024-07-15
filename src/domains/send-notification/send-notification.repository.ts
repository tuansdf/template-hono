import { eq } from "drizzle-orm";
import { db } from "~/database/db";
import { SendNotificationSave } from "~/domains/send-notification/send-notification.type";
import { SendNotificationTable } from "~/entities/send-notification.entity";

const selectAll = {
  id: SendNotificationTable.id,
  fromUserId: SendNotificationTable.fromUserId,
  toUserId: SendNotificationTable.toUserId,
  title: SendNotificationTable.title,
  content: SendNotificationTable.content,
  data: SendNotificationTable.data,
  type: SendNotificationTable.type,
  topic: SendNotificationTable.topic,
  navigateTo: SendNotificationTable.navigateTo,
  retryCount: SendNotificationTable.retryCount,
  status: SendNotificationTable.status,
  createdBy: SendNotificationTable.createdBy,
  updatedBy: SendNotificationTable.updatedBy,
  createdAt: SendNotificationTable.createdAt,
  updatedAt: SendNotificationTable.updatedAt,
} as const;

class SendNotificationRepository {
  public findAllByStatus = async (status: string) => {
    return db.main.select(selectAll).from(SendNotificationTable).where(eq(SendNotificationTable.status, status));
  };

  public save = async (item: SendNotificationSave) => {
    await db.main.insert(SendNotificationTable).values(item).returning(selectAll);
  };
}

export const sendNotificationRepository = new SendNotificationRepository();
