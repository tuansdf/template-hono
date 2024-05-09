import { NotFoundHandler } from "hono";
import { RouterUtils } from "~/utils/router.util.js";

export const notFound = (): NotFoundHandler => {
  return (c) => {
    const t = c.get("t");
    const errorPrefix = t("field.error_c") + ": ";
    return RouterUtils.response(c, 404, { message: errorPrefix + t("generic.error.not_found") });
  };
};
