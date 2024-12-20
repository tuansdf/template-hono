import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { ENV } from "~/constants/env.constant";
import { i18n } from "~/i18n/i18n.util";
import { errorHandler } from "~/middlewares/error-handler.middleware";
import { detectLanguage } from "~/middlewares/i18n.middleware";
import { loggerM } from "~/middlewares/logger.middleware";
import { notFound } from "~/middlewares/not-found.middleware";
import { apiRouter } from "~/routes/api.router";
import "~/db/db";

const app = new Hono();

app.use(loggerM());
app.use(cors());
app.use(secureHeaders());
app.use(detectLanguage());

app.route("/api", apiRouter);

app.notFound(notFound());
app.onError(errorHandler());

const initServices = async () => {
  await i18n.init();
};
await initServices();

const port = ENV.PORT || 5000;
console.log(`Server is running on port ${port}`);

// BUN

export default {
  fetch: app.fetch,
  port,
};
