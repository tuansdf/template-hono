import { PermissionTable } from "~/entities/permission.entity.js";
import { RoleTable } from "~/entities/role.entity.js";
import { UserTable } from "~/entities/user.entity.js";

export type UserSearchRequestDTO = {
  email: string;
  username: string;
};

export type User = typeof UserTable.$inferSelect & {
  roles?: (typeof RoleTable.$inferSelect)[];
  permissions?: (typeof PermissionTable.$inferSelect)[];
};
export type UserSave = typeof UserTable.$inferInsert;
