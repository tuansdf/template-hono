import * as process from "node:process";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().min(1),
  DB_URL: z.coerce.string().min(1),
  JWT_SECRET: z.coerce.string().min(1),
  JWT_ACCESS_LIFETIME: z.coerce.number().min(1),
  JWT_REFRESH_LIFETIME: z.coerce.number().min(1),
  TOKEN_RESET_PASSWORD_LIFETIME: z.coerce.number().min(1),
  TOKEN_ACTIVATE_ACCOUNT_LIFETIME: z.coerce.number().min(1),
  EMAIL_ACTIVATE_ACCOUNT_BASE_URL: z.coerce.string().min(1),
  EMAIL_RESET_PASSWORD_BASE_URL: z.coerce.string().min(1),
  ENV: z.coerce.string().min(1),
});

export const ENV = schema.parse(process.env);
