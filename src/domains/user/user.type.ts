import { PermissionDTO } from "~/domains/permission/permission.type";
import { RoleDTO } from "~/domains/role/role.type";
import { UserTable } from "~/entities/user.entity";
import { PartiallyNullish } from "~/types/common.type";

export type User = typeof UserTable.$inferSelect;
export type UserDTO = PartiallyNullish<
  User & {
    roles: RoleDTO[];
    permissions: PermissionDTO[];
    accessToken: string;
    refreshToken: string;
  }
>;
export type UserSave = typeof UserTable.$inferInsert;
export type UserSaveDTO = PartiallyNullish<UserSave>;

export type UserSearchRequestDTO = PartiallyNullish<{
  pageNumber: number;
  pageSize: number;
  q: string;
}>;
