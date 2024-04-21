import { z } from "zod";

const requireString = z.string();
const requireNumber = z.coerce.number();

export const ENV_DATABASE_HOST = requireString.parse(process.env.TH_DATABASE_HOST);
export const ENV_DATABASE_PORT = requireNumber.parse(process.env.TH_DATABASE_PORT);
export const ENV_DATABASE_USER = requireString.parse(process.env.TH_DATABASE_USER);
export const ENV_DATABASE_PASSWORD = requireString.parse(process.env.TH_DATABASE_PASSWORD);
export const ENV_DATABASE_DB_NAME = requireString.parse(process.env.TH_DATABASE_DB_NAME);

export const ENV_APP_PORT = requireNumber.parse(process.env.TH_APP_PORT);

export const ENV_JWT_SECRET = requireString.parse(process.env.TH_JWT_SECRET);
export const ENV_JWT_EXPIRED_MINUTES = requireNumber.parse(process.env.TH_JWT_EXPIRED_MINUTES);
