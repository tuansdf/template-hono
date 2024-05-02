import { Permission } from "~/domains/permission/permission.type.js";
import { Role } from "~/domains/role/role.type.js";
import { UserTable } from "~/entities/user.entity.js";

export type User = typeof UserTable.$inferSelect;

export type UserSave = typeof UserTable.$inferInsert;

export type UserDTO = {
  id?: number | null;
  email?: string | null;
  username?: string | null;
  roles?: Role[] | null;
  permissions?: Permission[] | null;
};

export type UserSearchRequestDTO = {
  pageNumber?: number | null;
  pageSize?: number | null;
  q?: string | null;
};
