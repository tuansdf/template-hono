import bcryptjs from "bcryptjs";
import { logger } from "~/lib/logger/logger";

const SALT_SIZE = 10;

export class HashUtils {
  static async hash(toBeHashed: string): Promise<string> {
    return await bcryptjs.hash(toBeHashed, SALT_SIZE);
  }

  static async verify(hashed: string, toBeVerified: string): Promise<boolean> {
    try {
      return await bcryptjs.compare(toBeVerified, hashed);
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
}
