import { apiRouter } from "~/routes/api.router";
import { viewRouter } from "~/routes/view.router";
import { RouterUtils } from "~/utils/router.util";

export const mainRouter = RouterUtils.init();

mainRouter.route("/api", apiRouter);
mainRouter.route("/", viewRouter);
