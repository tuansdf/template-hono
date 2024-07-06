import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "~/database/db";

await db.initAndRetry(false);
await migrate(db.main, { migrationsFolder: "./drizzle" });
await db.conn.end();
