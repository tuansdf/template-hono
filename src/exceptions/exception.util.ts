import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { CustomException } from "~/exceptions/custom-exception";
import { I18nUtils } from "~/i18n/i18n.util";
import { logger } from "~/lib/logger/logger";
import { RouterUtils } from "~/utils/router.util";

export class ExceptionUtils {
  static response: ErrorHandler = (err, c) => {
    const t = c.get("t");
    const errorPrefix = t("field.error_c") + ": ";
    logger.error(err);
    if (err instanceof CustomException) {
      return RouterUtils.response(c, err.status || 400, {
        message: errorPrefix + I18nUtils.getMessageAndParams(t, err.message || "generic.error.other"),
      });
    }
    if (err instanceof HTTPException) {
      return RouterUtils.response(c, err.status || 500, {
        message: errorPrefix + I18nUtils.getMessageAndParams(t, err.message || "generic.error.other"),
      });
    }
    if (err instanceof ZodError) {
      return RouterUtils.response(c, 400, {
        message: errorPrefix + I18nUtils.getMessageAndParams(t, err.errors[0]?.message || "generic.error.other"),
      });
    }
    return RouterUtils.response(c, 500, { message: errorPrefix + t("generic.error.other") });
  };
}
