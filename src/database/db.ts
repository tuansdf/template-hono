import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  ENV_DATABASE_DB_NAME,
  ENV_DATABASE_HOST,
  ENV_DATABASE_PASSWORD,
  ENV_DATABASE_PORT,
  ENV_DATABASE_USER,
} from "~/constants/env.constant.ts";

const pool = new Pool({
  host: ENV_DATABASE_HOST,
  port: ENV_DATABASE_PORT,
  user: ENV_DATABASE_USER,
  password: ENV_DATABASE_PASSWORD,
  database: ENV_DATABASE_DB_NAME,
});

export const db = drizzle(pool);
