import { RoleTable } from "~/entities/role.entity.js";

export type Role = typeof RoleTable.$inferSelect;
export type RoleSave = typeof RoleTable.$inferInsert;
export type RoleUpdate = {
  id: number;
  name?: string;
  description?: string;
};

export type CreateRoleBodyDTO = {
  code: string;
  name?: string;
  description?: string;
};

export type UpdateRoleBodyDTO = {
  id: number;
  name?: string;
  description?: string;
};
