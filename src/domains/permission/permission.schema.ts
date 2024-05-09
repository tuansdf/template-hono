import { z } from "zod";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type";

const idSchema = z.coerce
  .number({ required_error: "form.error.missing:::field.id", invalid_type_error: "form.error.invalid:::field.id" })
  .min(1, "form.error.invalid:::field.id");
const codeSchema = z
  .string({
    required_error: "form.error.missing:::field.code",
    invalid_type_error: "form.error.invalid:::field.code",
  })
  .trim()
  .min(1, "form.error.missing:::field.code")
  .max(255, "form.error.over_max_length:::field.code:::255")
  .toUpperCase();
const nameSchema = z
  .string({
    required_error: "form.error.missing:::field.name",
    invalid_type_error: "form.error.invalid:::field.name",
  })
  .trim()
  .min(1, "form.error.missing:::field.name")
  .max(255, "form.error.over_max_length:::field.name:::255");
const descriptionSchema = z
  .string({
    required_error: "form.error.missing:::field.description",
    invalid_type_error: "form.error.invalid:::field.description",
  })
  .trim()
  .min(1, "form.error.missing:::field.description")
  .max(255, "form.error.over_max_length:::field.description:::255");

export const createPermissionBodySchema: z.ZodType<CreatePermissionBodyDTO> = z.object({
  code: codeSchema,
  name: nameSchema.nullish(),
  description: descriptionSchema.nullish(),
});

export const updatePermissionBodySchema: z.ZodType<UpdatePermissionBodyDTO> = z.object({
  id: idSchema,
  name: nameSchema.nullish(),
  description: descriptionSchema.nullish(),
});
