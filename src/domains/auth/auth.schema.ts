import { z } from "zod";
import { LoginRequestDTO, RegisterRequestDTO } from "~/domains/auth/auth.type.js";

const emailSchema = z
  .string({
    required_error: "form.error.email.required",
  })
  .trim()
  .email("form.error.email.invalid_format");
const usernameSchema = z
  .string({
    required_error: "form.error.username.required",
  })
  .trim()
  .min(4, "form.error.username.min_length_4");
const passwordSchema = z
  .string({
    required_error: "form.error.password.required",
  })
  .min(8, "form.error.password.min_length_8")
  .max(32, "form.error.password.max_length_64");

export const loginRequestSchema: z.ZodType<LoginRequestDTO> = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerRequestSchema: z.ZodType<RegisterRequestDTO> = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});
