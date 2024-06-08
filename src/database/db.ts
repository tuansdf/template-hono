import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV_DB_DATABASE_NAME, ENV_DB_HOST, ENV_DB_PASSWORD, ENV_DB_PORT, ENV_DB_USER } from "~/constants/env.constant";
import { UserTable } from "~/entities/user.entity";

class Database {
  private _main: NodePgDatabase = {} as NodePgDatabase;
  private RETRY_MAX = 5;
  private retryCount = 0;

  public async init() {
    const pool = new Pool({
      host: ENV_DB_HOST,
      port: ENV_DB_PORT,
      user: ENV_DB_USER,
      password: ENV_DB_PASSWORD,
      database: ENV_DB_DATABASE_NAME,
    });
    this._main = drizzle(pool);
    await this.healthCheck();
  }

  public async initAndRetry() {
    try {
      if (this.retryCount > 0) {
        console.info("Reconnecting to databases " + this.retryCount);
      } else {
        console.info("Connecting to databases");
      }
      await this.init();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
      if (this.retryCount >= this.RETRY_MAX) {
        throw new Error("Error connecting to databases");
      }
      this.retryCount++;
      await this.initAndRetry();
    }
  }

  public async healthCheck() {
    await this._main.select({ id: UserTable.id }).from(UserTable).limit(1);
  }

  public get main(): NodePgDatabase {
    return this._main;
  }
}

export const db = new Database();
