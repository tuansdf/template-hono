import { z } from "zod";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type.js";

export const createPermissionBodySchema: z.ZodType<CreatePermissionBodyDTO> = z.object({
  code: z.string().trim().toUpperCase(),
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const updatePermissionBodySchema: z.ZodType<UpdatePermissionBodyDTO> = z.object({
  id: z.number().min(1),
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
});
