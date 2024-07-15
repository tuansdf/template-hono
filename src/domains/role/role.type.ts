import { RoleTable } from "~/entities/role.entity";

export type Role = typeof RoleTable.$inferSelect;
export type RoleDTO = Partial<Role>;
export type RoleSave = typeof RoleTable.$inferInsert;
export type RoleSaveDTO = Partial<RoleSave>;

export type CreateRoleBodyDTO = {
  code: string;
  name?: string | null;
  description?: string | null;
};

export type UpdateRoleBodyDTO = {
  id: number;
  name?: string | null;
  description?: string | null;
};
