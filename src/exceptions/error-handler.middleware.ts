import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { RouterUtils } from "~/utils/router.util.js";

export const errorHandler = (): ErrorHandler => {
  return (err, c) => {
    const t = c.get("t");
    console.error(err);
    if (err instanceof HTTPException) {
      return RouterUtils.response(c, { status: err.status || 500, message: t(err.message || "common.error.other") });
    }
    if (err instanceof ZodError) {
      return RouterUtils.response(c, { status: 400, message: t(err.errors[0]?.message || "common.error.other") });
    }
    return RouterUtils.response(c, { status: 500, message: t("common.error.other") });
  };
};
