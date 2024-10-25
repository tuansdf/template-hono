import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as process from "node:process";
import { ENV } from "~/constants/env.constant";

const db = drizzle(ENV.DB_URL);
await migrate(db, { migrationsFolder: "./drizzle" });
console.info("DONE");
process.exit(0);
