import { eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { MapRolePermissionTable } from "~/entities/map-role-permission.entity.js";
import { MapUserRoleTable } from "~/entities/map-user-role.entity.js";
import { PermissionTable } from "~/entities/permission.entity.js";

const commonSelect = {
  id: PermissionTable.id,
  code: PermissionTable.code,
  name: PermissionTable.code,
  description: PermissionTable.description,
};

export class PermissionRepository {
  static async findAll() {
    return db.select(commonSelect).from(PermissionTable);
  }

  static async findAllByRoleId(roleId: number) {
    return db
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .where(eq(MapRolePermissionTable.roleId, roleId));
  }

  static async findAllByUserId(userId: number) {
    return db
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, MapRolePermissionTable.roleId))
      .where(eq(MapUserRoleTable.userId, userId));
  }
}
