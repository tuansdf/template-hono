import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { PermissionDTO, PermissionSave, PermissionSaveDTO } from "@/domains/permission/permission.type";
import { permissionTable } from "@/db/schemas/permission.schema";
import { rolePermissionTable } from "@/db/schemas/role-permission.schema";
import { userRoleTable } from "@/db/schemas/user-role.schema";

const selectAll = {
  id: permissionTable.id,
  code: permissionTable.code,
  name: permissionTable.code,
  description: permissionTable.description,
  status: permissionTable.status,
  createdBy: permissionTable.createdBy,
  updatedBy: permissionTable.updatedBy,
  createdAt: permissionTable.createdAt,
  updatedAt: permissionTable.updatedAt,
} as const;

class PermissionRepository {
  public async findAll(): Promise<PermissionDTO[]> {
    return db.main.select(selectAll).from(permissionTable);
  }

  public async findTopById(id: string): Promise<PermissionDTO | undefined> {
    const result = await db.main.select(selectAll).from(permissionTable).where(eq(permissionTable.id, id)).limit(1);
    return result[0];
  }

  public async findAllByRoleId(roleId: string): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(permissionTable)
      .innerJoin(rolePermissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
      .where(eq(rolePermissionTable.roleId, roleId));
  }

  public async findAllByUserId(userId: string): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(permissionTable)
      .innerJoin(rolePermissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
      .innerJoin(userRoleTable, eq(userRoleTable.roleId, rolePermissionTable.roleId))
      .where(eq(userRoleTable.userId, userId));
  }

  public async countById(id: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(permissionTable).where(eq(permissionTable.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(permissionTable)
      .where(eq(permissionTable.id, id))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(permissionTable).where(eq(permissionTable.code, code));
    return result[0]?.value || 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(permissionTable)
      .where(eq(permissionTable.code, code))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(permission: PermissionSave): Promise<PermissionDTO | undefined> {
    const result = await db.main.insert(permissionTable).values(permission).returning(selectAll);
    return result[0];
  }

  public async update(request: PermissionSaveDTO): Promise<PermissionDTO | undefined> {
    const result = await db.main
      .update(permissionTable)
      .set({ name: request.name, description: request.description })
      .where(eq(permissionTable.id, request.id || ""))
      .returning(selectAll);
    return result[0];
  }
}

export const permissionRepository = new PermissionRepository();
