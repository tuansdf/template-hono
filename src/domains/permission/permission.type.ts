import { PermissionTable } from "~/entities/permission.entity.js";

export type Permission = typeof PermissionTable.$inferSelect;
export type PermissionSave = typeof PermissionTable.$inferInsert;
export type PermissionUpdate = {
  id: number;
  name?: string;
  description?: string;
};

export type CreatePermissionBodyDTO = {
  code: string;
  name?: string;
  description?: string;
};

export type UpdatePermissionBodyDTO = {
  id: number;
  name?: string;
  description?: string;
};
