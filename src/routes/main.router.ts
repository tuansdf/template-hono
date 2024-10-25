import { Hono } from "hono";
import { detectLanguage } from "~/i18n/i18n.middleware";
import { apiRouter } from "~/routes/api.router";
import { viewRouter } from "~/routes/view.router";

export const mainRouter = new Hono();

mainRouter.use(detectLanguage());
mainRouter.route("/api", apiRouter);
mainRouter.route("/_", viewRouter);
