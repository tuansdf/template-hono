import { z } from "zod";
import { PermissionDTO } from "@/domains/permission/permission.type";
import { RoleDTO } from "@/domains/role/role.type";
import { searchUserQuerySchema } from "@/domains/user/user.schema";
import { userTable } from "@/db/schemas/user.schema";
import { PartiallyNullish } from "@/types/common.type";

export type User = typeof userTable.$inferSelect;
export type UserDTO = PartiallyNullish<
  User & {
    roles: RoleDTO[];
    permissions: PermissionDTO[];
    accessToken: string;
    refreshToken: string;
  }
>;
export type UserSave = typeof userTable.$inferInsert;
export type UserSaveDTO = PartiallyNullish<UserSave>;

export type UserSearchRequestDTO = z.infer<typeof searchUserQuerySchema>;
