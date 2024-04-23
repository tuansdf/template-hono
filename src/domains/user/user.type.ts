import { PermissionTable } from "~/entities/permission.entity.js";
import { RoleTable } from "~/entities/role.entity.js";
import { UserTable } from "~/entities/user.entity.js";

export type UserSearchRequestDTO = {
  email: string;
  username: string;
};

export type User = typeof UserTable.$inferSelect;

export type UserSave = typeof UserTable.$inferInsert;

export type Role = typeof RoleTable.$inferSelect;

export type Permission = typeof PermissionTable.$inferSelect;

export type UserDTO = {
  id?: number | null;
  email?: string | null;
  username?: string | null;
  roles?: Role[] | null;
  permissions?: Permission[] | null;
};
