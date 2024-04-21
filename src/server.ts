import dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import "~/constants/env.constant.js";
import { ENV_APP_PORT } from "~/constants/env.constant.js";
import "~/database/db.js";
import { ErrorHandlerMiddleware } from "~/exceptions/error-handler.middleware.js";
import { I18nMiddleware } from "~/i18n/i18n.middleware.js";
import { NotFoundMiddleware } from "~/middlewares/not-found.middleware.js";
import { routes } from "~/routes.js";

dotenv.config();

const app = new Hono();

app.use(logger());
app.use(cors());
app.use(secureHeaders());
app.use(I18nMiddleware.handle());

app.route("/", routes);

app.notFound(NotFoundMiddleware.handle());
app.onError(ErrorHandlerMiddleware.handle());

const port = ENV_APP_PORT || 5000;
console.log(`Server is running on port ${port}`);

export default {
  fetch: app.fetch,
  port,
};
