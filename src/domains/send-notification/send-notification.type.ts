import { SendNotificationTable } from "~/entities/send-notification.entity";

export type SendNotification = typeof SendNotificationTable.$inferSelect;
export type SendNotificationDTO = Partial<SendNotification>;
export type SendNotificationSave = typeof SendNotificationTable.$inferInsert;
export type SendNotificationSaveDTO = Partial<SendNotificationSave>;
