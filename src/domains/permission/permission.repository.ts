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
  public async findAll() {
    return db.main.select(commonSelect).from(PermissionTable);
  }

  public async findTopById(id: number) {
    const result = await db.main.select(commonSelect).from(PermissionTable).where(eq(PermissionTable.id, id)).limit(1);
    return result?.[0];
  }

  public async findAllByRoleId(roleId: number) {
    return db.main
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .where(eq(MapRolePermissionTable.roleId, roleId));
  }

  public async findAllByUserId(userId: number) {
    return db.main
      .select(commonSelect)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, MapRolePermissionTable.roleId))
      .where(eq(MapUserRoleTable.userId, userId));
  }

  public async countByCode(code: string) {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.code, code));
    return result?.[0]?.value || 0;
  }

  public async countById(id: number) {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.id, id));
    return result?.[0]?.value || 0;
  }

  public async existById(id: number) {
    const result = await this.countById(id);
    return result > 0;
  }

  public async existByCode(code: string) {
    const result = await this.countByCode(code);
    return result > 0;
  }

  public async save(permission: PermissionSave) {
    await db.main.insert(PermissionTable).values(permission);
  }

  public async update(request: PermissionUpdate) {
    await db.main
      .update(PermissionTable)
      .set({ name: request.name, description: request.description })
      .where(eq(PermissionTable.id, Number(request.id)));
  }
}

export const permissionRepository = new PermissionRepository();
