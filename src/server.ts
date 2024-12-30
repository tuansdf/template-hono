import { ENV } from "@/constants/env.constant";
import { i18n } from "@/lib/i18n";
import { errorHandler } from "@/middlewares/error-handler.middleware";
import { detectLanguage } from "@/middlewares/i18n.middleware";
import { loggerM } from "@/middlewares/logger.middleware";
import { notFound } from "@/middlewares/not-found.middleware";
import { routes } from "@/routes/routes";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import "@/db/db";

const app = new Hono();

app.use(loggerM());
app.use(cors());
app.use(secureHeaders());
app.use(detectLanguage());

app.route("/api", routes);

app.notFound(notFound());
app.onError(errorHandler());

await i18n.init();

const port = ENV.PORT || 5000;
console.log(`Server is running on port ${port}`);

// BUN

export default {
  fetch: app.fetch,
  port,
};
