import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: String(process.env.DB_HOST),
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE_NAME),
  },
});
