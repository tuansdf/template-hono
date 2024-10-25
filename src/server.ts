import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { ENV } from "~/constants/env.constant";
import { db } from "~/database/db";
import { i18n } from "~/i18n/i18n.util";
import { errorHandler } from "~/middlewares/error-handler.middleware";
import { loggerM } from "~/middlewares/logger.middleware";
import { notFound } from "~/middlewares/not-found.middleware";
import { mainRouter } from "~/routes/main.router";
import "dotenv/config";
import "~/constants/env.constant";

const app = new Hono();

app.use(loggerM());
app.use(cors());
app.use(secureHeaders());

app.route("/", mainRouter);

app.notFound(notFound());
app.onError(errorHandler());

const initServices = async () => {
  await i18n.init();
  await db.initAndRetry();
};
await initServices();

const port = ENV.PORT || 5000;
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
