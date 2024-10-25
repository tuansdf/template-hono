import * as process from "node:process";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number(),
  DB_URL: z.coerce.string(),
  JWT_SECRET: z.coerce.string(),
  JWT_ACCESS_LIFETIME: z.coerce.number(),
  JWT_REFRESH_LIFETIME: z.coerce.number(),
  TOKEN_RESET_PASSWORD_LIFETIME: z.coerce.number(),
  TOKEN_ACTIVATE_ACCOUNT_LIFETIME: z.coerce.number(),
  EMAIL_ACTIVATE_ACCOUNT_BASE_URL: z.coerce.string(),
  EMAIL_RESET_PASSWORD_BASE_URL: z.coerce.string(),
  ENV: z.coerce.string(),
});

export const ENV = schema.parse(process.env);
