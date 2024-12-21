import { StatusCode } from "~/types/status-code.type";

export type PartiallyNullish<TObject> = {
  [TKey in keyof TObject]?: TObject[TKey] | null | undefined;
};

export type CommonResponse<T = unknown> = {
  status: StatusCode;
  message?: string | null;
  data?: T | null;
};
