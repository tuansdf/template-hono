import { z } from "zod";
import { UserSearchRequestDTO } from "~/domains/user/user.type";

export const getUserDetailByUsernameQuerySchema = z.object({
  q: z.string({
    required_error: "form.error.missing:::field.username",
    invalid_type_error: "dynamic.error.not_found:::field.username",
  }),
});

export const getUserDetailByEmailQuerySchema = z.object({
  q: z.string({
    required_error: "form.error.missing:::field.email",
    invalid_type_error: "dynamic.error.not_found:::field.email",
  }),
});

export const searchUserQuerySchema: z.ZodType<UserSearchRequestDTO> = z.object({
  q: z.string().nullish(),
  pageNumber: z.coerce.number().nullish().default(1),
  pageSize: z.coerce.number().nullish().default(15),
});

export const getUserDetailByIdParamSchema = z.object({
  id: z.coerce.number({
    required_error: "form.error.missing:::field.id",
    invalid_type_error: "dynamic.error.not_found:::field.id",
  }),
});
