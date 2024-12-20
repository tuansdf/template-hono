import { v4, v7 } from "uuid";

export const uuid = (version: 4 | 7 = 7) => {
  return version === 4 ? v4().toString() : v7().toString();
};
