import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/entities/*.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: String(process.env.DB_HOST),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: String(process.env.DB_DATABASE_NAME),
  },
} satisfies Config;
