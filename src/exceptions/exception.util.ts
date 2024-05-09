import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { CustomException } from "~/exceptions/custom-exception.js";
import { I18nUtils } from "~/i18n/i18n.util.js";
import { logger } from "~/lib/logger/logger.js";
import { RouterUtils } from "~/utils/router.util.js";

export class ExceptionUtils {
  static response: ErrorHandler = (err, c) => {
    const t = c.get("t");
    logger.error(err);
    if (err instanceof CustomException) {
      return RouterUtils.response(c, err.status || 500, {
        message: t("field.error_c") + ": " + I18nUtils.getMessageAndParams(t, err.message || "common.error.other"),
      });
    }
    if (err instanceof HTTPException) {
      return RouterUtils.response(c, err.status || 500, {
        message: t("field.error_c") + ": " + err.message || t("common.error.other"),
      });
    }
    if (err instanceof ZodError) {
      return RouterUtils.response(c, 400, {
        message:
          t("field.error_c") + ": " + I18nUtils.getMessageAndParams(t, err.errors[0]?.message || "common.error.other"),
      });
    }
    return RouterUtils.response(c, 500, { message: t("common.error.other") });
  };
}
