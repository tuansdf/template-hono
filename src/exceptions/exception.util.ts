import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { CustomException } from "~/exceptions/custom-exception";
import { TFn } from "~/i18n/i18n.type";
import { i18nUtils } from "~/i18n/i18n.util";
import { CommonResponse } from "~/types/common.type";
import { StatusCode } from "~/types/status-code.type";

class ExceptionUtils {
  public getCommonResponse = (err: Error, t: TFn): CommonResponse => {
    let errorMessage = "";
    let status: StatusCode = 500;
    if (err instanceof CustomException) {
      status = err.status || 400;
      errorMessage = i18nUtils.getMessageAndParams(t, err.message || "generic.error.other");
    }
    if (err instanceof HTTPException) {
      status = err.status || 500;
      errorMessage = i18nUtils.getMessageAndParams(t, err.message || "generic.error.other");
    }
    if (err instanceof ZodError) {
      status = 400;
      errorMessage = i18nUtils.getMessageAndParams(t, err.errors[0]?.message || "generic.error.other");
    }
    return { message: errorMessage || t("generic.error.other"), status };
  };

  public getMessage = (err: Error, t: TFn): string => {
    return this.getCommonResponse(err, t).message!;
  };
}

export const exceptionUtils = new ExceptionUtils();
