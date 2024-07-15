import { eq } from "drizzle-orm";
import { db } from "~/database/db";
import { SendNotificationDTO, SendNotificationSave } from "~/domains/send-notification/send-notification.type";
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
  public async findAllByStatus(status: string): Promise<SendNotificationDTO[]> {
    return db.main.select(selectAll).from(SendNotificationTable).where(eq(SendNotificationTable.status, status));
  }

  public async save(item: SendNotificationSave): Promise<SendNotificationDTO | undefined> {
    const result = await db.main.insert(SendNotificationTable).values(item).returning(selectAll);
    return result[0];
  }
}

export const sendNotificationRepository = new SendNotificationRepository();
