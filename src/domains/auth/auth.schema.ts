import { z } from "zod";
import {
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from "~/domains/auth/auth.type";
import { emailSchema, passwordSchema, tokenSchema, usernameSchema } from "~/schemas/common.schema";

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

export const resetPasswordRequestSchema: z.ZodType<ResetPasswordRequestDTO> = z
  .object({
    t: tokenSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "form.error.not_match:::field.password_confirm",
    path: ["passwordConfirm"],
  });

export const activateAccountBodySchema = z.object({
  t: tokenSchema,
});
