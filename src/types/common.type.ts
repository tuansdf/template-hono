import { StatusCode } from "~/types/status-code.type.js";

export type Nullish = undefined | null | void;

export type CommonResponse<T = unknown> = {
  status: StatusCode;
  message?: string | Nullish;
  data?: T | Nullish;
};
