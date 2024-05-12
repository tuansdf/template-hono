import * as crypto from "node:crypto";

export class TokenUtils {
  static random = (size: number = 32) => {
    return crypto.randomBytes(size).toString("hex");
  };
}
