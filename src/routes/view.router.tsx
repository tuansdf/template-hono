import type { FC, PropsWithChildren } from "hono/jsx";
import { resetPasswordRequestSchema } from "~/domains/auth/auth.schema";
import { AuthService } from "~/domains/auth/auth.service";
import { ExceptionUtils } from "~/exceptions/exception.util";
import { TFn } from "~/i18n/i18n.type";
import { cn } from "~/utils/classname.util";
import { RouterUtils } from "~/utils/router.util";

export const viewRouter = RouterUtils.init();

const Layout: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css" />
        <title>{title}</title>
      </head>
      <body className="container" style={{ height: "100vh" }}>
        {children}
      </body>
    </html>
  );
};

const AnnouncePage: FC<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <Layout title={title}>
      <div className="align-middle">
        <p>{message}</p>
      </div>
    </Layout>
  );
};

const ResetPasswordPage: FC<{ token: string; t: TFn }> = ({ token, t }) => {
  const title = t("view.reset_password.title");
  return (
    <Layout title={title}>
      <form
        hx-post={`/password/reset?t=${token}`}
        className="align-middle"
        hx-target="#error-message"
        hx-swap="outerHTML"
      >
        <h1>{title}</h1>
        <fieldset>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="password"
            className="form-control mb-3"
            autoFocus
            required
          />
          <label htmlFor="passwordConfirm" className="form-label">
            Confirm password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="••••••••"
            autoComplete="password"
            className="form-control mb-3"
            required
          />
          <input name="t" type="text" value={token} hidden readOnly aria-hidden />
        </fieldset>
        <div hidden id="error-message"></div>
        <input className="btn btn-primary" type="submit" value="Submit" />
      </form>
    </Layout>
  );
};

const AlertMessage: FC<{ message: string; isError: boolean }> = ({ message, isError }) => {
  return (
    <div className={cn("alert", isError ? "alert-danger" : "alert-success")} id="error-message">
      {message}
    </div>
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
  return c.html(<AnnouncePage title={t("auth.message.activate_account_email_subject")} message={t(message)} />);
});

viewRouter.get("/password/reset", async (c) => {
  const t = c.get("t");
  const token = c.req.query("t");
  return c.html(<ResetPasswordPage token={String(token)} t={t} />);
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
  return c.html(<AlertMessage isError={!!errorMessage} message={errorMessage || successMessage} />);
});
