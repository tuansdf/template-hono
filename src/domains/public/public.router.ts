import { AuthService } from "~/domains/auth/auth.service";
import { ExceptionUtils } from "~/exceptions/exception.util";
import { logger } from "~/lib/logger/logger";
import { RouterUtils } from "~/utils/router.util";

export const publicRouter = RouterUtils.init();

publicRouter.get("/account/activate", async (c) => {
  const t = c.get("t");
  const token = c.req.query("t");
  if (!token) {
    return c.text(t("auth.message.activate_account_failed"), 400);
  }
  try {
    await AuthService.activateAccount(token);
  } catch (e) {
    logger.error(e);
    return c.text(ExceptionUtils.getMessage(e as Error, t), 400);
  }
  return c.text(t("auth.message.activate_account_successful"), 200);
});
