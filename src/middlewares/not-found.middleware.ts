import { NotFoundHandler } from "hono";

export const notFound = (): NotFoundHandler => {
  return (c) => {
    const t = c.get("t");
    return c.json({ status: 404, message: t("common.error.not_found") }, 400);
  };
};
