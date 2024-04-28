import { hash, verify } from "argon2";

export class HashUtils {
  static async hash(toBeHashed: string): Promise<string> {
    return hash(toBeHashed);
  }

  static async verify(hashed: string, toBeVerified: string): Promise<boolean> {
    return verify(hashed, toBeVerified);
  }
}
