import { mainRouter } from "~/routes/main.router";
import { routerUtils } from "~/utils/router.util";

export const langRouter = routerUtils.init((app) => {
  app.route("/:lng", mainRouter);
  app.route("/", mainRouter);
});
