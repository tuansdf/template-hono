import { NotificationTable } from "~/entities/notification.entity";

export type Notification = typeof NotificationTable.$inferSelect;
export type NotificationDTO = Partial<Notification>;
export type NotificationSave = typeof NotificationTable.$inferInsert;
export type NotificationSaveDTO = Partial<NotificationSave>;
