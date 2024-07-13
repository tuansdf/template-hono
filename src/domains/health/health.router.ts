import { db } from "~/database/db";
import { routerUtils } from "~/utils/router.util";

export const healthRouter = routerUtils.init((app) => {
  app.all("/", async (c) => {
    await db.healthCheck();
    return c.text("OK");
  });
});
