import { ErrorHandler } from "hono";
import { exceptionUtils } from "~/exceptions/exception.util";
import { logger } from "~/lib/logger/logger";

export const errorHandler = (): ErrorHandler => {
  return (err, c) => {
    const t = c.get("t");
    logger.error(err);
    const commonResponse = exceptionUtils.getCommonResponse(err, t);
    return c.json({ message: commonResponse.message }, commonResponse.status);
  };
};