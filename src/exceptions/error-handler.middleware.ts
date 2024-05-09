import { ErrorHandler } from "hono";
import { ExceptionUtils } from "~/exceptions/exception.util";

export const errorHandler = (): ErrorHandler => {
  return ExceptionUtils.response;
};
