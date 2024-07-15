import { count, eq } from "drizzle-orm";
import { db } from "~/database/db";
import { PermissionDTO, PermissionSave, PermissionSaveDTO } from "~/domains/permission/permission.type";
import { MapRolePermissionTable } from "~/entities/map-role-permission.entity";
import { MapUserRoleTable } from "~/entities/map-user-role.entity";
import { PermissionTable } from "~/entities/permission.entity";

const selectAll = {
  id: PermissionTable.id,
  code: PermissionTable.code,
  name: PermissionTable.code,
  description: PermissionTable.description,
  status: PermissionTable.status,
  createdBy: PermissionTable.createdBy,
  updatedBy: PermissionTable.updatedBy,
  createdAt: PermissionTable.createdAt,
  updatedAt: PermissionTable.updatedAt,
} as const;

class PermissionRepository {
  public async findAll(): Promise<PermissionDTO[]> {
    return db.main.select(selectAll).from(PermissionTable);
  }

  public async findTopById(id: number): Promise<PermissionDTO | undefined> {
    const result = await db.main.select(selectAll).from(PermissionTable).where(eq(PermissionTable.id, id)).limit(1);
    return result[0];
  }

  public async findAllByRoleId(roleId: number): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .where(eq(MapRolePermissionTable.roleId, roleId));
  }

  public async findAllByUserId(userId: number): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(PermissionTable)
      .innerJoin(MapRolePermissionTable, eq(MapRolePermissionTable.permissionId, PermissionTable.id))
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, MapRolePermissionTable.roleId))
      .where(eq(MapUserRoleTable.userId, userId));
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.code, code));
    return result[0]?.value || 0;
  }

  public async countById(id: number): Promise<number> {
    const result = await db.main.select({ value: count() }).from(PermissionTable).where(eq(PermissionTable.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: number): Promise<boolean> {
    const result = await this.countById(id);
    return result > 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await this.countByCode(code);
    return result > 0;
  }

  public async save(permission: PermissionSave): Promise<PermissionDTO | undefined> {
    const result = await db.main.insert(PermissionTable).values(permission).returning(selectAll);
    return result[0];
  }

  public async update(request: PermissionSaveDTO): Promise<PermissionDTO | undefined> {
    const result = await db.main
      .update(PermissionTable)
      .set({ name: request.name, description: request.description })
      .where(eq(PermissionTable.id, Number(request.id)))
      .returning();
    return result[0];
  }
}

export const permissionRepository = new PermissionRepository();
