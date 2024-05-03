import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export const errorHandler = (): ErrorHandler => {
  return (err, c) => {
    const t = c.get("t");
    // console.error(err);
    if (err instanceof HTTPException) {
      return c.json({ status: err.status, message: t(err.message || "common.error.other") }, err.status);
    }
    if (err instanceof ZodError) {
      return c.json({ status: 400, message: t(err.errors[0]?.message || "common.error.other") }, 400);
    }
    return c.json({ status: 500, message: t("common.error.other") }, 500);
  };
};
