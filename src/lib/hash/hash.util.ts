import bcryptjs from "bcryptjs";
import { logger } from "~/lib/logger/logger";

const SALT_SIZE = 10;

class HashUtils {
  public async hash(toBeHashed: string): Promise<string> {
    return await bcryptjs.hash(toBeHashed, SALT_SIZE);
  }

  public async verify(hashed: string, toBeVerified: string): Promise<boolean> {
    try {
      return await bcryptjs.compare(toBeVerified, hashed);
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
}

export const hashUtils = new HashUtils();
