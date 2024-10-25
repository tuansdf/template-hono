import { sql } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { ENV } from "~/constants/env.constant";
import { logger } from "~/lib/logger/logger";

class Database {
  private _main!: NodePgDatabase;
  private RETRY_MAX = 5;
  private retryCount = 0;

  public async init(doHealthCheck: boolean = true) {
    this._main = drizzle(ENV.DB_URL, {
      logger: {
        logQuery(query: string, params: unknown[]) {
          logger.info(query + " -- params: " + params.join(", "));
        },
      },
    });
    if (doHealthCheck) await this.healthCheck();
  }

  public async initAndRetry(doHealthCheck: boolean = true) {
    try {
      if (this.retryCount > 0) {
        console.info("Reconnecting to databases " + this.retryCount);
      } else {
        console.info("Connecting to databases");
      }
      await this.init(doHealthCheck);
    } catch {
      if (this.retryCount >= this.RETRY_MAX) {
        throw new Error("Error connecting to databases");
      }
      this.retryCount++;
      await new Promise((r) => setTimeout(r, 1000));
      await this.initAndRetry();
    }
  }

  public async healthCheck() {
    await this._main.execute(sql`select 1`);
  }

  public get main(): NodePgDatabase {
    return this._main;
  }
}

export const db = new Database();
