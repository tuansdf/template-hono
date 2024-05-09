import { NotFoundHandler } from "hono";
import { RouterUtils } from "~/utils/router.util.js";

export const notFound = (): NotFoundHandler => {
  return (c) => {
    const t = c.get("t");
    return RouterUtils.response(c, 404, { message: t("generic.error.not_found") });
  };
};
