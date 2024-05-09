import dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { ENV_APP_PORT } from "~/constants/env.constant";
import { errorHandler } from "~/exceptions/error-handler.middleware";
import { detectLanguage } from "~/i18n/i18n.middleware";
import { loggerM } from "~/middlewares/logger.middleware";
import { notFound } from "~/middlewares/not-found.middleware";
import { routes } from "~/routes";

import "~/constants/env.constant";
import "~/database/db";
import "~/i18n/i18n.util";

dotenv.config();

const app = new Hono();

app.use(loggerM());
app.use(cors());
app.use(secureHeaders());
app.use(detectLanguage());

app.route("/", routes);

app.notFound(notFound());
app.onError(errorHandler());

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
