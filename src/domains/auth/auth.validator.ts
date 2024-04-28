import { loginRequestSchema, registerRequestSchema } from "~/domains/auth/auth.schema.js";

export class AuthValidator {
  static validateLoginRequest(data: unknown) {
    return loginRequestSchema.parse(data);
  }

  static validateRegisterRequest(data: unknown) {
    return registerRequestSchema.parse(data);
  }
}
