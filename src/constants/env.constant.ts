import * as console from "node:console";
import * as process from "node:process";
import { z } from "zod";

const ENV_OBJ = process.env || {};

const requireString = (input: unknown, field: string) => {
  try {
    return z.string().parse(input);
  } catch (e) {
    console.error(`Invalid ENV ${field}`);
    process.exit(1);
  }
};

const requireNumber = (input: unknown, field: string) => {
  try {
    return z.coerce.number().parse(input);
  } catch (e) {
    console.error(`Invalid ENV ${field}`);
    process.exit(1);
  }
};

export const ENV_DB_HOST = requireString(ENV_OBJ.APP_DB_HOST, "DB_HOST");
export const ENV_DB_PORT = requireNumber(ENV_OBJ.APP_DB_PORT, "DB_PORT");
export const ENV_DB_USER = requireString(ENV_OBJ.APP_DB_USER, "DB_USER");
export const ENV_DB_PASSWORD = requireString(ENV_OBJ.APP_DB_PASSWORD, "DB_PASSWORD");
export const ENV_DB_DATABASE_NAME = requireString(ENV_OBJ.APP_DB_DATABASE_NAME, "DB_DATABASE_NAME");

export const ENV_APP_PORT = requireNumber(ENV_OBJ.APP_PORT, "PORT");

export const ENV_JWT_SECRET = requireString(ENV_OBJ.APP_JWT_SECRET, "JWT_SECRET");
export const ENV_JWT_ACCESS_LIFETIME = requireNumber(ENV_OBJ.APP_JWT_ACCESS_LIFETIME, "JWT_ACCESS_LIFETIME");
export const ENV_JWT_REFRESH_LIFETIME = requireNumber(ENV_OBJ.APP_JWT_REFRESH_LIFETIME, "JWT_REFRESH_LIFETIME");
export const ENV_TOKEN_RESET_PASSWORD_LIFETIME = requireNumber(
  ENV_OBJ.APP_TOKEN_RESET_PASSWORD_LIFETIME,
  "TOKEN_RESET_PASSWORD_LIFETIME",
);
export const ENV_TOKEN_ACTIVATE_ACCOUNT_LIFETIME = requireNumber(
  ENV_OBJ.APP_TOKEN_ACTIVATE_ACCOUNT_LIFETIME,
  "TOKEN_ACTIVATE_ACCOUNT_LIFETIME",
);

export const ENV_EMAIL_ACTIVATE_ACCOUNT_BASE_URL = requireString(
  ENV_OBJ.APP_EMAIL_ACTIVATE_ACCOUNT_BASE_URL,
  "EMAIL_ACTIVATE_ACCOUNT_BASE_URL",
);
export const ENV_EMAIL_RESET_PASSWORD_BASE_URL = requireString(
  ENV_OBJ.APP_EMAIL_RESET_PASSWORD_BASE_URL,
  "EMAIL_RESET_PASSWORD_BASE_URL",
);
