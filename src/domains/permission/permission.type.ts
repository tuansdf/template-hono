import { PermissionTable } from "~/entities/permission.entity";

export type Permission = typeof PermissionTable.$inferSelect;
export type PermissionDTO = Partial<Permission>;
export type PermissionSave = typeof PermissionTable.$inferInsert;
export type PermissionSaveDTO = Partial<PermissionSave>;

export type CreatePermissionBodyDTO = {
  code: string;
  name?: string | null;
  description?: string | null;
};

export type UpdatePermissionBodyDTO = {
  id: string;
  name?: string | null;
  description?: string | null;
};
