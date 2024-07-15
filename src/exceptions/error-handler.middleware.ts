import { ErrorHandler } from "hono";
import { exceptionUtils } from "~/exceptions/exception.util";
import { logger } from "~/lib/logger/logger";
import { routerUtils } from "~/utils/router.util";

export const errorHandler = (): ErrorHandler => {
  return (err, c) => {
    const t = c.get("t");
    logger.error(err);
    const commonResponse = exceptionUtils.getCommonResponse(err, t, true);
    return routerUtils.response(c, commonResponse.status, { message: commonResponse.message });
  };
};
