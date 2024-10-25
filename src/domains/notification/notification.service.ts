import { notificationRepository } from "~/domains/notification/notification.repository";
import { NotificationSave } from "~/domains/notification/notification.type";

class NotificationService {
  public async send(item: NotificationSave) {
    // TODO: actually send notification
    await notificationRepository.save(item);
  }
}

export const notificationService = new NotificationService();
