import { z } from "zod";
import { LoginRequestDTO, RegisterRequestDTO } from "~/domains/auth/auth.type.js";

const passwordSchema = z.string().min(8).max(32);

export const loginRequestSchema: z.ZodType<LoginRequestDTO> = z.object({
  username: z.string().trim().min(4),
  password: passwordSchema,
});

export const registerRequestSchema: z.ZodType<RegisterRequestDTO> = z.object({
  email: z.string().trim().email().min(1),
  username: z.string().trim().min(4),
  password: passwordSchema,
});
