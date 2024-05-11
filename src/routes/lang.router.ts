import { mainRouter } from "~/routes/main.router";
import { RouterUtils } from "~/utils/router.util";

export const langRouter = RouterUtils.init();

langRouter.route("/:lng", mainRouter);
langRouter.route("/", mainRouter);
