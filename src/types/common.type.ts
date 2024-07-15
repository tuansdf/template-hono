import { StatusCode } from "~/types/status-code.type";

export type CommonResponse<T = unknown> = {
  status: StatusCode;
  message?: string | null;
  data?: T | null;
};
