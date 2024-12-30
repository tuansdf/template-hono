import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { NotificationDTO, NotificationSave } from "@/domains/notification/notification.type";
import { notifications } from "@/db/schemas/notification.schema";

const selectAll = {
  id: notifications.id,
  fromUserId: notifications.fromUserId,
  toUserId: notifications.toUserId,
  title: notifications.title,
  content: notifications.content,
  data: notifications.data,
  type: notifications.type,
  topic: notifications.topic,
  navigateTo: notifications.navigateTo,
  retryCount: notifications.retryCount,
  status: notifications.status,
  createdBy: notifications.createdBy,
  updatedBy: notifications.updatedBy,
  createdAt: notifications.createdAt,
  updatedAt: notifications.updatedAt,
} as const;

class NotificationRepository {
  public async findAllByStatus(status: string): Promise<NotificationDTO[]> {
    return db.main.select(selectAll).from(notifications).where(eq(notifications.status, status));
  }

  public async save(item: NotificationSave): Promise<NotificationDTO | undefined> {
    const result = await db.main.insert(notifications).values(item).returning(selectAll);
    return result[0];
  }
}

export const notificationRepository = new NotificationRepository();
