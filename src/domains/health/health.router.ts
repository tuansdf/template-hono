import { db } from "~/database/db";
import { routerUtils } from "~/utils/router.util";

export const healthRouter = routerUtils.init((app) => {
  app.get("/", async (c) => {
    await db.healthCheck();
    return c.text("OK");
  });

  app.post("/", async (c) => {
    await db.healthCheck();
    return c.text("OK");
  });
});
