import { eq } from "drizzle-orm";
import { db } from "~/db/db";
import { NotificationDTO, NotificationSave } from "~/domains/notification/notification.type";
import { NotificationTable } from "~/entities/notification.entity";

const selectAll = {
  id: NotificationTable.id,
  fromUserId: NotificationTable.fromUserId,
  toUserId: NotificationTable.toUserId,
  title: NotificationTable.title,
  content: NotificationTable.content,
  data: NotificationTable.data,
  type: NotificationTable.type,
  topic: NotificationTable.topic,
  navigateTo: NotificationTable.navigateTo,
  retryCount: NotificationTable.retryCount,
  status: NotificationTable.status,
  createdBy: NotificationTable.createdBy,
  updatedBy: NotificationTable.updatedBy,
  createdAt: NotificationTable.createdAt,
  updatedAt: NotificationTable.updatedAt,
} as const;

class NotificationRepository {
  public async findAllByStatus(status: string): Promise<NotificationDTO[]> {
    return db.main.select(selectAll).from(NotificationTable).where(eq(NotificationTable.status, status));
  }

  public async save(item: NotificationSave): Promise<NotificationDTO | undefined> {
    const result = await db.main.insert(NotificationTable).values(item).returning(selectAll);
    return result[0];
  }
}

export const notificationRepository = new NotificationRepository();
