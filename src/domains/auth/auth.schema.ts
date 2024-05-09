import { z } from "zod";
import {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type";

const emailSchema = z
  .string({
    required_error: "form.error.missing:::field.email",
    invalid_type_error: "form.error.invalid:::field.email",
  })
  .trim()
  .email("form.error.invalid:::field.email");
const usernameSchema = z
  .string({
    required_error: "form.error.missing:::field.username",
    invalid_type_error: "form.error.invalid:::field.username",
  })
  .trim()
  .min(2, "form.error.under_min_length:::field.username:::2")
  .max(255, "form.error.over_max_length:::field.username:::255");
const passwordSchema = z
  .string({
    required_error: "form.error.missing:::field.password",
    invalid_type_error: "form.error.invalid:::field.password",
  })
  .min(8, "form.error.under_min_length:::field.password:::8")
  .max(64, "form.error.over_max_length:::field.password:::64");

export const loginRequestSchema: z.ZodType<LoginRequestDTO> = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerRequestSchema: z.ZodType<RegisterRequestDTO> = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const forgotPasswordRequestSchema: z.ZodType<ForgotPasswordRequestDTO> = z.object({
  username: usernameSchema,
});

export const resetPasswordRequestSchema: z.ZodType<ResetPasswordRequestDTO> = z.object({
  password: passwordSchema,
});
