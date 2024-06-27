import { detectLanguage } from "~/i18n/i18n.middleware";
import { apiRouter } from "~/routes/api.router";
import { viewRouter } from "~/routes/view.router";
import { RouterUtils } from "~/utils/router.util";

export const mainRouter = RouterUtils.init();

mainRouter.use(detectLanguage());
mainRouter.route("/api", apiRouter);
mainRouter.route("/_", viewRouter);
