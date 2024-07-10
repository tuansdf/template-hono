import * as crypto from "node:crypto";

class TokenUtils {
  public random = (size: number = 32) => {
    return crypto.randomBytes(size).toString("hex");
  };
}

export const tokenUtils = new TokenUtils();
