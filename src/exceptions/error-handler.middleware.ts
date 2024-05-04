import { ErrorHandler } from "hono";
import { ExceptionUtils } from "~/exceptions/exception.util.js";

export const errorHandler = (): ErrorHandler => {
  return ExceptionUtils.response;
};
