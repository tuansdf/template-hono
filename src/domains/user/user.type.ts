import { Permission } from "~/domains/permission/permission.type.js";
import { Role } from "~/domains/role/role.type.js";
import { UserTable } from "~/entities/user.entity.js";
import { Nullish } from "~/types/common.type.js";

export type User = typeof UserTable.$inferSelect;

export type UserSave = typeof UserTable.$inferInsert;

export type UserDTO = {
  id?: number | Nullish;
  email?: string | Nullish;
  username?: string | Nullish;
  roles?: Role[] | Nullish;
  permissions?: Permission[] | Nullish;
};

export type UserSearchRequestDTO = {
  pageNumber?: number | Nullish;
  pageSize?: number | Nullish;
  q?: string | Nullish;
};
