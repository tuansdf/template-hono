import { notificationTable } from "@/db/schemas/notification.schema";

export type Notification = typeof notificationTable.$inferSelect;
export type NotificationDTO = Partial<Notification>;
export type NotificationSave = typeof notificationTable.$inferInsert;
export type NotificationSaveDTO = Partial<NotificationSave>;
