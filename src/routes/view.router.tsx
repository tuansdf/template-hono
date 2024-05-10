import type { FC, PropsWithChildren } from "hono/jsx";
import { resetPasswordRequestSchema } from "~/domains/auth/auth.schema";
import { AuthService } from "~/domains/auth/auth.service";
import { ExceptionUtils } from "~/exceptions/exception.util";
import { RouterUtils } from "~/utils/router.util";

export const viewRouter = RouterUtils.init();

const Layout: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
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

const ResetPasswordPage: FC<{ title: string; token: string }> = ({ title, token }) => {
  return (
    <Layout title={title}>
      <form method="POST" action="/password/reset" className="align-middle">
        <h1>Reset your password</h1>
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
          />
          <input name="t" type="text" className="invisible" value={token} hidden />
        </fieldset>
        <input className="btn btn-primary" type="submit" value="Submit" />
      </form>
    </Layout>
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
  return c.html(<ResetPasswordPage title={t("auth.message.reset_password_email_subject")} token={String(token)} />);
});

viewRouter.post("/password/reset", async (c) => {
  const t = c.get("t");
  let message: string;
  try {
    const body = await resetPasswordRequestSchema.parseAsync(await c.req.parseBody());
    await AuthService.resetPassword(body);
    message = t("auth.message.reset_password_success");
  } catch (e) {
    message = ExceptionUtils.getMessage(e as Error, t);
  }
  return c.html(<AnnouncePage title={t("auth.message.reset_password_email_subject")} message={message} />);
});
