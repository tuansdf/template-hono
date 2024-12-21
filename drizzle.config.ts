import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { ENV } from "src/constants/env.constant";

export default defineConfig({
  schema: "./src/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DB_URL,
  },
});
