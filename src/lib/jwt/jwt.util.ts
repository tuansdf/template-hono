import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from "jose";
import { ENV } from "~/constants/env.constant";

const secret = new TextEncoder().encode(ENV.JWT_SECRET);
const signHeader = { alg: "HS256" };
const verifyOptions = { algorithms: ["HS256"] };

class Jwt {
  public async decode(toBeDecoded: string) {
    return decodeJwt(toBeDecoded);
  }
  public async sign(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload).setProtectedHeader(signHeader).sign(secret);
  }
  public async verify(toBeVerified: string): Promise<JWTPayload> {
    return jwtVerify(toBeVerified, secret, verifyOptions);
  }
}

export const jwt = new Jwt();
