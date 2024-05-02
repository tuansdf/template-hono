import { z } from "zod";
import { UserSearchRequestDTO } from "~/domains/user/user.type.js";

export const getDetailUserQuerySchema = z.object({
  q: z.string().min(1),
});

export const searchUserQuerySchema: z.ZodType<UserSearchRequestDTO> = z.object({
  q: z.string().nullish(),
  pageNumber: z.coerce.number().nullish().default(1),
  pageSize: z.coerce.number().nullish().default(15),
});
