import { permissions } from "@/db/schemas/permission.schema";

export type Permission = typeof permissions.$inferSelect;
export type PermissionDTO = Partial<Permission>;
export type PermissionSave = typeof permissions.$inferInsert;
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
