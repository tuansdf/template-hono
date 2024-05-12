import { hash, verify } from "argon2";
import { logger } from "~/lib/logger/logger";

export class HashUtils {
  static async hash(toBeHashed: string): Promise<string> {
    return hash(toBeHashed);
  }

  static async verify(hashed: string, toBeVerified: string): Promise<boolean> {
    try {
      return await verify(hashed, toBeVerified);
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
}
