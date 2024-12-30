import { notifications } from "@/db/schemas/notification.schema";

export type Notification = typeof notifications.$inferSelect;
export type NotificationDTO = Partial<Notification>;
export type NotificationSave = typeof notifications.$inferInsert;
export type NotificationSaveDTO = Partial<NotificationSave>;
