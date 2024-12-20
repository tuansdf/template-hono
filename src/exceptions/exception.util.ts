import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { CustomException } from "~/exceptions/custom-exception";
import { TFn } from "~/i18n/i18n.type";
import { i18nUtils } from "~/i18n/i18n.util";
import { CommonResponse } from "~/types/common.type";
import { StatusCode } from "~/types/status-code.type";

class ExceptionUtils {
  public getResponse = (error: Error, t: TFn): [StatusCode, CommonResponse] => {
    let errorMessage = "";
    let status: StatusCode = 500;
    if (error instanceof CustomException) {
      status = error.status || 400;
      errorMessage = i18nUtils.getMessageAndParams(t, error.message || "generic.error.other");
    }
    if (error instanceof HTTPException) {
      status = error.status || 500;
      errorMessage = i18nUtils.getMessageAndParams(t, error.message || "generic.error.other");
    }
    if (error instanceof ZodError) {
      status = 400;
      errorMessage = i18nUtils.getMessageAndParams(t, error.errors[0]?.message || "generic.error.other");
    }
    return [status, { message: errorMessage || t("generic.error.other"), status }];
  };

  public getMessage = (err: Error, t: TFn): string => {
    return this.getResponse(err, t)[1].message!;
  };
}

export const exceptionUtils = new ExceptionUtils();
