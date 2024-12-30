import { roleTable } from "@/db/schemas/role.schema";

export type Role = typeof roleTable.$inferSelect;
export type RoleDTO = Partial<Role>;
export type RoleSave = typeof roleTable.$inferInsert;
export type RoleSaveDTO = Partial<RoleSave>;

export type CreateRoleBodyDTO = {
  code: string;
  name?: string | null;
  description?: string | null;
};

export type UpdateRoleBodyDTO = {
  id: string;
  name?: string | null;
  description?: string | null;
};
