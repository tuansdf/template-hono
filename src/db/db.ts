import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as process from "node:process";
import * as schema from "src/db/schemas";
import { ENV } from "@/constants/env.constant";
import { logger } from "@/lib/logger";

class Database {
  private readonly _main;

  public constructor() {
    try {
      logger.info("Connecting to databases");
      this._main = drizzle(ENV.DB_URL, { schema });
      logger.info("Connected to databases");
    } catch (e) {
      logger.error("Error connecting to databases", e);
      process.exit(1);
    }
  }

  public async healthCheck() {
    try {
      await this._main?.execute(sql`select 1`);
    } catch (e) {
      throw new Error("Error connecting to databases " + e);
    }
  }

  public get main() {
    return this._main!;
  }
}

export const db = new Database();
