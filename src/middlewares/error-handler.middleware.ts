import { ErrorHandler } from "hono";
import { exceptionUtils } from "~/exceptions/exception.util";
import { logger } from "~/lib/logger/logger";

export const errorHandler = (): ErrorHandler => (error, c) => {
  const t = c.get("t");
  logger.error(error);
  const [status, response] = exceptionUtils.getResponse(error, t);
  return Response.json({ message: response.message }, { status });
};
