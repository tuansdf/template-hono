import { detectLanguage } from "~/i18n/i18n.middleware";
import { apiRouter } from "~/routes/api.router";
import { viewRouter } from "~/routes/view.router";
import { routerUtils } from "~/utils/router.util";

export const mainRouter = routerUtils.init((app) => {
  app.use(detectLanguage());
  app.route("/api", apiRouter);
  app.route("/_", viewRouter);
});
