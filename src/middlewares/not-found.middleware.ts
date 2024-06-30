import { NotFoundHandler } from "hono";
import { routerUtils } from "~/utils/router.util";

export const notFound = (): NotFoundHandler => {
  return (c) => {
    const t = c.get("t");
    const errorPrefix = t("field.error_c") + ": ";
    return routerUtils.response(c, 404, { message: errorPrefix + t("generic.error.not_found") });
  };
};
