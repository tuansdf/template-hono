import { decode, sign, verify } from "hono/jwt";
import { ENV_JWT_SECRET } from "~/constants/env.constant";
import { JwtTokenPayload } from "~/lib/jwt/jwt.type";

class JwtUtils {
  public async decode(toBeDecoded: string) {
    return decode(toBeDecoded);
  }

  public async sign(payload: JwtTokenPayload): Promise<string> {
    return sign(payload, ENV_JWT_SECRET, "HS256");
  }

  public async verify(toBeVerified: string): Promise<JwtTokenPayload> {
    return verify(toBeVerified, ENV_JWT_SECRET, "HS256");
  }
}

export const jwtUtils = new JwtUtils();
