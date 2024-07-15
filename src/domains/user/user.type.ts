import { PermissionDTO } from "~/domains/permission/permission.type";
import { RoleDTO } from "~/domains/role/role.type";
import { UserTable } from "~/entities/user.entity";

export type User = typeof UserTable.$inferSelect;
export type UserDTO = Partial<User> & {
  roles?: RoleDTO[] | null;
  permissions?: PermissionDTO[] | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};
export type UserSave = typeof UserTable.$inferInsert;
export type UserSaveDTO = Partial<UserSave>;

export type UserSearchRequestDTO = {
  pageNumber?: number | null;
  pageSize?: number | null;
  q?: string | null;
};
