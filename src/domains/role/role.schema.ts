import { z } from "zod";
import { CreateRoleBodyDTO, UpdateRoleBodyDTO } from "~/domains/role/role.type.js";

export const createRoleBodySchema: z.ZodType<CreateRoleBodyDTO> = z.object({
  code: z.string().trim().toUpperCase(),
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const updateRoleBodySchema: z.ZodType<UpdateRoleBodyDTO> = z.object({
  id: z.number().min(1),
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
});
