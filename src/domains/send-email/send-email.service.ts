import { SendEmailRepository } from "~/domains/send-email/send-email.repository";
import { SendEmailSave } from "~/domains/send-email/send-email.type";

export class SendEmailService {
  static send = async (item: SendEmailSave) => {
    // TODO: actual send email
    await SendEmailRepository.save(item);
  };
}
