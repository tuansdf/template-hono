import { StatusCode } from "~/types/status-code.type";

export type Nullish = undefined | null;

export type CommonResponse<T = unknown> = {
  status: StatusCode;
  message?: string | Nullish;
  data?: T | Nullish;
};
