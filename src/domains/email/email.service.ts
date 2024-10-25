import { ENV } from "~/constants/env.constant";
import { TYPE } from "~/constants/type.constant";
import { emailRepository } from "~/domains/email/email.repository";
import { EmailSave } from "~/domains/email/email.type";
import { TFn } from "~/i18n/i18n.type";

class EmailService {
  public async send(item: EmailSave) {
    // TODO: actually send email
    await emailRepository.save(item);
  }

  public async sendResetPasswordEmail({
    userUsername,
    userEmail,
    token,
    t,
  }: {
    userUsername: string;
    userEmail: string;
    token: string;
    t: TFn;
  }) {
    const item: EmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: userEmail,
      type: TYPE.RESET_PASSWORD,
      subject: t("auth.message.reset_password_email_subject"),
      content: t("auth.message.reset_password_email_content", {
        1: userUsername,
        2: ENV.EMAIL_RESET_PASSWORD_BASE_URL + token,
      }),
    };
    await this.send(item);
  }

  public async sendActivateAccountEmail({
    userUsername,
    userEmail,
    token,
    t,
  }: {
    userUsername: string;
    userEmail: string;
    token: string;
    t: TFn;
  }) {
    const item: EmailSave = {
      fromEmail: "PLACEHOLDER",
      toEmail: userEmail,
      type: TYPE.ACTIVATE_ACCOUNT,
      subject: t("auth.message.activate_account_email_subject"),
      content: t("auth.message.activate_account_email_content", {
        1: userUsername,
        2: ENV.EMAIL_ACTIVATE_ACCOUNT_BASE_URL + token,
      }),
    };
    await this.send(item);
  }
}

export const emailService = new EmailService();
