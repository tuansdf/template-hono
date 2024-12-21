import { z } from "zod";

export const searchUserQuerySchema = z.object({
  q: z.string().nullish(),
  pageNumber: z.coerce.number().nullish().default(1),
  pageSize: z.coerce.number().nullish().default(15),
});
