import { RoleTable } from "~/entities/role.entity.js";
import { Nullish } from "~/types/common.type.js";

export type Role = typeof RoleTable.$inferSelect;
export type RoleSave = typeof RoleTable.$inferInsert;
export type RoleUpdate = Partial<RoleSave>;

export type CreateRoleBodyDTO = {
  code: string;
  name?: string | Nullish;
  description?: string | Nullish;
};

export type UpdateRoleBodyDTO = {
  id: number;
  name?: string | Nullish;
  description?: string | Nullish;
};
