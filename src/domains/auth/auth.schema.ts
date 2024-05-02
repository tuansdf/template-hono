import { z } from "zod";
import { LoginRequestDTO, RegisterRequestDTO } from "~/domains/auth/auth.type.js";

const emailSchema = z
  .string({
    required_error: "form.error.email.required",
    invalid_type_error: "form.error.email.invalid",
  })
  .trim()
  .email("form.error.email.invalid");
const usernameSchema = z
  .string({
    required_error: "form.error.username.required",
    invalid_type_error: "form.error.username.invalid",
  })
  .trim()
  .min(4, "form.error.username.min_length_4")
  .max(255, "form.error.username.max_length_255");
const passwordSchema = z
  .string({
    required_error: "form.error.password.required",
    invalid_type_error: "form.error.password.invalid",
  })
  .min(8, "form.error.password.min_length_8")
  .max(64, "form.error.password.max_length_64");

export const loginRequestSchema: z.ZodType<LoginRequestDTO> = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerRequestSchema: z.ZodType<RegisterRequestDTO> = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});
