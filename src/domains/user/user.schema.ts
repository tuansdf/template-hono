import { z } from "zod";
import { UserSearchRequestDTO } from "~/domains/user/user.type";

export const searchUserQuerySchema: z.ZodType<UserSearchRequestDTO> = z.object({
  q: z.string().nullish(),
  pageNumber: z.coerce.number().nullish().default(1),
  pageSize: z.coerce.number().nullish().default(15),
});
