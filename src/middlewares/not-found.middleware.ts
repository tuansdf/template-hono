import { NotFoundHandler } from "hono";

export const notFound = (): NotFoundHandler => (c) => {
  const t = c.get("t");
  return Response.json({ message: t("generic.error.not_found") }, { status: 404 });
};
