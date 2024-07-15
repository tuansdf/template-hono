import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as process from "node:process";
import { Pool } from "pg";
import { ENV_DB_DATABASE_NAME, ENV_DB_HOST, ENV_DB_PASSWORD, ENV_DB_PORT, ENV_DB_USER } from "~/constants/env.constant";

const client = new Pool({
  host: ENV_DB_HOST,
  port: ENV_DB_PORT,
  user: ENV_DB_USER,
  password: ENV_DB_PASSWORD,
  database: ENV_DB_DATABASE_NAME,
  max: 1,
});
const db = drizzle(client);
await migrate(db, { migrationsFolder: "./drizzle" });
await client.end();
console.info("DONE");
process.exit(0);
