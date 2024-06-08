import { count, eq } from "drizzle-orm";
import { db } from "~/database/db";
import { PermissionSave, PermissionUpdate } from "~/domains/permission/permission.type";
import { MapRolePermissionTable } from "~/entities/map-role-permission.entity";
import { MapUserRoleTable } from "~/entities/map-user-role.entity";
import { PermissionTable } from "~/entities/permission.entity";

const commonSelect = {
  id: PermissionTable.id,
  code: PermissionTable.code,
  name: PermissionTable.code,
  description: PermissionTable.description,
  status: PermissionTable.status,
  createdBy: PermissionTable.createdBy,
  updatedBy: PermissionTable.updatedBy,
  createdAt: PermissionTable.createdAt,
  updatedAt: PermissionTable.updatedAt,
};

export class PermissionRepository {
  static async findAll() {
    return db.main.select(commonSelect).from(PermissionTable);
  }

  static async findTopById(id: number) {
    const result = await db.main.select(commonSelect).from(PermissionTable).where(eq(PermissionTable.id, id)).limit(1);
    return result?.[0];
  }

  static async findAllByRoleId(roleId: number) {
    return db.main
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .where(eq(MapRolePermissionTable.roleId, roleId));
  }

  static async findAllByUserId(userId: number) {
    return db.main
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, MapRolePermissionTable.roleId))
      .where(eq(MapUserRoleTable.userId, userId));
  }

  static async countByCode(code: string) {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.code, code));
    return result?.[0]?.value || 0;
  }

  static async countById(id: number) {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.id, id));
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
    await db.main.insert(PermissionTable).values(permission);
  }

  static async update(request: PermissionUpdate) {
    await db.main
      .update(PermissionTable)
      .set({ name: request.name, description: request.description })
      .where(eq(PermissionTable.id, Number(request.id)));
  }
}
