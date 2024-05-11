import type { FC, PropsWithChildren } from "hono/jsx";
import { resetPasswordRequestSchema } from "~/domains/auth/auth.schema";
import { AuthService } from "~/domains/auth/auth.service";
import { ExceptionUtils } from "~/exceptions/exception.util";
import { TFn } from "~/i18n/i18n.type";
import { RouterUtils } from "~/utils/router.util";

export const viewRouter = RouterUtils.init();

const Layout: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {
  return (
    <html style={{ "--pico-font-size": "100%" }}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.indigo.min.css" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};

const AnnouncePage: FC<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <Layout title={title}>
      <main className="container">
        <div>{message}</div>
      </main>
    </Layout>
  );
};

const ResetPasswordPage: FC<{ formUrl: string; token: string; t: TFn }> = ({ formUrl, token, t }) => {
  const title = t("view.reset_password.title");
  return (
    <Layout title={title}>
      <main className="container" style={{ maxWidth: "30rem" }}>
        <form hx-post={formUrl} hx-target="#error-message" hx-swap="outerHTML">
          <h1>{title}</h1>
          <fieldset style={{ marginBottom: 0 }}>
            <label for="password">{t("field.password_c")}</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autocomplete="password"
              autofocus
              minlength={8}
              maxlength={64}
              required
            />
            <label for="passwordConfirm">{t("field.password_confirm_c")}</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="••••••••"
              autocomplete="password"
              minlength={8}
              maxlength={64}
              required
            />
            <input name="t" type="text" value={token} hidden readonly aria-hidden />
          </fieldset>
          <div hidden id="error-message"></div>
          <input type="submit" value={t("view.button.submit")} />
        </form>
      </main>
    </Layout>
  );
};

const AlertMessage: FC<{ message: string; isError: boolean }> = ({ message, isError }) => {
  return (
    <article id="error-message" style={{ color: isError ? "#ef4444" : "#10b981" }}>
      {message}
    </article>
  );
};

viewRouter.get("/account/activate", async (c) => {
  const t = c.get("t");
  let message: string;
  try {
    const token = c.req.query("t");
    await AuthService.activateAccount(String(token));
    message = t("auth.message.activate_account_success");
  } catch (e) {
    message = ExceptionUtils.getMessage(e as Error, t);
  }
  return c.html(<AnnouncePage title={t("view.activate_account.title")} message={t(message)} />);
});

viewRouter.get("/password/reset", async (c) => {
  const t = c.get("t");
  const token = c.req.query("t");
  return c.html(<ResetPasswordPage formUrl={`${c.req.path}?t=${token}`} token={String(token)} t={t} />);
});

viewRouter.post("/password/reset", async (c) => {
  const t = c.get("t");
  let errorMessage: string = "";
  let successMessage: string = "";
  try {
    const body = await resetPasswordRequestSchema.parseAsync(await c.req.parseBody());
    await AuthService.resetPassword(body);
    successMessage = t("auth.message.reset_password_success");
  } catch (e) {
    errorMessage = ExceptionUtils.getMessage(e as Error, t);
  }
  return c.html(<AlertMessage isError={!!errorMessage} message={errorMessage || successMessage} />, 200);
});
