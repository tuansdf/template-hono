import { SendNotificationTable } from "~/entities/send-notification.entity";

export type SendNotification = typeof SendNotificationTable.$inferSelect;
export type SendNotificationSave = typeof SendNotificationTable.$inferInsert;
