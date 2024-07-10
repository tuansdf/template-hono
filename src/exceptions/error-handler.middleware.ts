import { ErrorHandler } from "hono";
import { exceptionUtils } from "~/exceptions/exception.util";

export const errorHandler = (): ErrorHandler => {
  return exceptionUtils.response;
};
