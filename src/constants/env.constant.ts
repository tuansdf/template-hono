import { z } from "zod";

const requireString = z.string();
const requireNumber = z.coerce.number();

export const ENV_DB_HOST = requireString.parse(process.env.TH_DB_HOST);
export const ENV_DB_PORT = requireNumber.parse(process.env.TH_DB_PORT);
export const ENV_DB_USER = requireString.parse(process.env.TH_DB_USER);
export const ENV_DB_PASSWORD = requireString.parse(process.env.TH_DB_PASSWORD);
export const ENV_DB_DATABASE_NAME = requireString.parse(process.env.TH_DB_DATABASE_NAME);

export const ENV_APP_PORT = requireNumber.parse(process.env.TH_APP_PORT);

export const ENV_JWT_SECRET = requireString.parse(process.env.TH_JWT_SECRET);
export const ENV_JWT_EXPIRED_MINUTES = requireNumber.parse(process.env.TH_JWT_EXPIRED_MINUTES);
