import { z } from "zod";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type.js";

const idSchema = z.coerce.number({ required_error: "form.error.id.invalid" }).min(1, "form.error.id.invalid");
const codeSchema = z
  .string({
    required_error: "form.error.code.required",
    invalid_type_error: "form.error.code.invalid",
  })
  .trim()
  .min(1, "form.error.code.required")
  .max(255, "form.error.code.max_length_255")
  .toUpperCase();
const nameSchema = z
  .string({
    required_error: "form.error.name.required",
    invalid_type_error: "form.error.name.invalid",
  })
  .trim()
  .min(1, "form.error.name.required")
  .max(255, "form.error.name.max_length_255");
const descriptionSchema = z
  .string({
    required_error: "form.error.description.required",
    invalid_type_error: "form.error.description.invalid",
  })
  .trim()
  .min(1, "form.error.description.required")
  .max(255, "form.error.description.max_length_255");

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
