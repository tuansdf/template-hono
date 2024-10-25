import { NotFoundHandler } from "hono";

export const notFound = (): NotFoundHandler => {
  return (c) => {
    const t = c.get("t");
    return c.json({ message: t("generic.error.not_found") }, 404);
  };
};
