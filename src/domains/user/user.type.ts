import { Permission } from "~/domains/permission/permission.type";
import { Role } from "~/domains/role/role.type";
import { UserTable } from "~/entities/user.entity";
import { Nullish } from "~/types/common.type";

export type User = typeof UserTable.$inferSelect;

export type UserSelect = Partial<Record<keyof User, IGNORE>>;

export type UserSave = typeof UserTable.$inferInsert;

export type UserDTO = {
  id?: number | Nullish;
  email?: string | Nullish;
  name?: string | Nullish;
  username?: string | Nullish;
  roles?: Role[] | Nullish;
  permissions?: Permission[] | Nullish;
  accessToken?: string | Nullish;
  refreshToken?: string | Nullish;
};

export type UserSearchRequestDTO = {
  pageNumber?: number | Nullish;
  pageSize?: number | Nullish;
  q?: string | Nullish;
};
