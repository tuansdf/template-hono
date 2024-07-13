import dotenv from "dotenv";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { ENV_APP_PORT } from "~/constants/env.constant";
import { db } from "~/database/db";
import { errorHandler } from "~/exceptions/error-handler.middleware";
import { i18n } from "~/i18n/i18n.util";
import { loggerM } from "~/middlewares/logger.middleware";
import { notFound } from "~/middlewares/not-found.middleware";
import { langRouter } from "~/routes/lang.router";
import { routerUtils } from "~/utils/router.util";
import "~/constants/env.constant";

dotenv.config();

const app = routerUtils.init((app) => {
  app.use(loggerM());
  app.use(cors());
  app.use(secureHeaders());

  app.route("/", langRouter);

  app.notFound(notFound());
  app.onError(errorHandler());
});

const initServices = async () => {
  await i18n.init();
  await db.initAndRetry();
};
await initServices();

const port = ENV_APP_PORT || 5000;
console.log(`Server is running on port ${port}`);

// NODEJS

// serve({
//   fetch: app.fetch,
//   port,
// });

// BUN

export default {
  fetch: app.fetch,
  port,
};
