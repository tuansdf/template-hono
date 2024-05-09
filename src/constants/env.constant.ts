import { z } from "zod";

const ENV_OBJ = process.env || {};

const requireString = z.string();
const requireNumber = z.coerce.number();

export const ENV_DB_HOST = requireString.parse(ENV_OBJ.APP_DB_HOST);
export const ENV_DB_PORT = requireNumber.parse(ENV_OBJ.APP_DB_PORT);
export const ENV_DB_USER = requireString.parse(ENV_OBJ.APP_DB_USER);
export const ENV_DB_PASSWORD = requireString.parse(ENV_OBJ.APP_DB_PASSWORD);
export const ENV_DB_DATABASE_NAME = requireString.parse(ENV_OBJ.APP_DB_DATABASE_NAME);

export const ENV_APP_PORT = requireNumber.parse(ENV_OBJ.APP_PORT);

export const ENV_JWT_SECRET = requireString.parse(ENV_OBJ.APP_JWT_SECRET);
export const ENV_JWT_ACCESS_LIFETIME = requireNumber.parse(ENV_OBJ.APP_JWT_ACCESS_LIFETIME);
export const ENV_JWT_REFRESH_LIFETIME = requireNumber.parse(ENV_OBJ.APP_JWT_REFRESH_LIFETIME);
export const ENV_JWT_RESET_PASSWORD_LIFETIME = requireNumber.parse(ENV_OBJ.APP_JWT_RESET_PASSWORD_LIFETIME);
export const ENV_JWT_ACTIVATE_ACCOUNT_LIFETIME = requireNumber.parse(ENV_OBJ.APP_JWT_ACTIVATE_ACCOUNT_LIFETIME);
