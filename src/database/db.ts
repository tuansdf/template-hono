import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  ENV_DB_DATABASE_NAME,
  ENV_DB_HOST,
  ENV_DB_PASSWORD,
  ENV_DB_PORT,
  ENV_DB_USER,
} from "~/constants/env.constant.js";

const pool = new Pool({
  host: ENV_DB_HOST,
  port: ENV_DB_PORT,
  user: ENV_DB_USER,
  password: ENV_DB_PASSWORD,
  database: ENV_DB_DATABASE_NAME,
});

export const db = drizzle(pool);
