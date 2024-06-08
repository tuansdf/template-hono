import dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { ENV_APP_PORT } from "~/constants/env.constant";
import { db } from "~/database/db";
import { errorHandler } from "~/exceptions/error-handler.middleware";
import { i18n } from "~/i18n/i18n.util";
import { loggerM } from "~/middlewares/logger.middleware";
import { notFound } from "~/middlewares/not-found.middleware";
import { langRouter } from "~/routes/lang.router";

import "~/constants/env.constant";

dotenv.config();

const app = new Hono();

app.use(loggerM());
app.use(cors());
app.use(secureHeaders());

app.route("/", langRouter);

app.notFound(notFound());
app.onError(errorHandler());

await i18n.init();
await db.initAndRetry();

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
