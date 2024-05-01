import { count, eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { PermissionSave, PermissionUpdate } from "~/domains/permission/permission.type.js";
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

  static async findTopById(id: number) {
    const result = await db.select(commonSelect).from(PermissionTable).where(eq(PermissionTable.id, id)).limit(1);
    return result?.[0];
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

  static async countByCode(code: string) {
    const result = await db.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.code, code));
    return result?.[0]?.value || 0;
  }

  static async countById(id: number) {
    const result = await db.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.id, id));
    return result?.[0]?.value || 0;
  }

  static async existById(id: number) {
    const result = await this.countById(id);
    return result > 0;
  }

  static async existByCode(code: string) {
    const result = await this.countByCode(code);
    return result > 0;
  }

  static async save(permission: PermissionSave) {
    await db.insert(PermissionTable).values(permission);
  }

  static async updateById(request: PermissionUpdate) {
    await db
      .update(PermissionTable)
      .set({ name: request.name, description: request.description })
      .where(eq(PermissionTable.id, request.id));
  }
}
