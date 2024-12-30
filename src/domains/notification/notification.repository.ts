import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { NotificationDTO, NotificationSave } from "@/domains/notification/notification.type";
import { notificationTable } from "@/db/schemas/notification.schema";

const selectAll = {
  id: notificationTable.id,
  fromUserId: notificationTable.fromUserId,
  toUserId: notificationTable.toUserId,
  title: notificationTable.title,
  content: notificationTable.content,
  data: notificationTable.data,
  type: notificationTable.type,
  topic: notificationTable.topic,
  navigateTo: notificationTable.navigateTo,
  retryCount: notificationTable.retryCount,
  status: notificationTable.status,
  createdBy: notificationTable.createdBy,
  updatedBy: notificationTable.updatedBy,
  createdAt: notificationTable.createdAt,
  updatedAt: notificationTable.updatedAt,
} as const;

class NotificationRepository {
  public async findAllByStatus(status: string): Promise<NotificationDTO[]> {
    return db.main.select(selectAll).from(notificationTable).where(eq(notificationTable.status, status));
  }

  public async save(item: NotificationSave): Promise<NotificationDTO | undefined> {
    const result = await db.main.insert(notificationTable).values(item).returning(selectAll);
    return result[0];
  }
}

export const notificationRepository = new NotificationRepository();
