import { PermissionTable } from "~/entities/permission.entity.js";
import { Nullish } from "~/types/common.type.js";

export type Permission = typeof PermissionTable.$inferSelect;
export type PermissionSave = typeof PermissionTable.$inferInsert;
export type PermissionUpdate = {
  id: number;
  name?: string | Nullish;
  description?: string | Nullish;
};

export type CreatePermissionBodyDTO = {
  code: string;
  name?: string | Nullish;
  description?: string | Nullish;
};

export type UpdatePermissionBodyDTO = {
  id: number;
  name?: string | Nullish;
  description?: string | Nullish;
};
