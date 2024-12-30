import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { PermissionDTO, PermissionSave, PermissionSaveDTO } from "@/domains/permission/permission.type";
import { permissions } from "@/db/schemas/permission.schema";
import { rolePermissions } from "@/db/schemas/role-permission.schema";
import { userRoles } from "@/db/schemas/user-role.schema";

const selectAll = {
  id: permissions.id,
  code: permissions.code,
  name: permissions.code,
  description: permissions.description,
  status: permissions.status,
  createdBy: permissions.createdBy,
  updatedBy: permissions.updatedBy,
  createdAt: permissions.createdAt,
  updatedAt: permissions.updatedAt,
} as const;

class PermissionRepository {
  public async findAll(): Promise<PermissionDTO[]> {
    return db.main.select(selectAll).from(permissions);
  }

  public async findTopById(id: string): Promise<PermissionDTO | undefined> {
    const result = await db.main.select(selectAll).from(permissions).where(eq(permissions.id, id)).limit(1);
    return result[0];
  }

  public async findAllByRoleId(roleId: string): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(permissions)
      .innerJoin(rolePermissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
  }

  public async findAllByUserId(userId: string): Promise<PermissionDTO[]> {
    return db.main
      .select(selectAll)
      .from(permissions)
      .innerJoin(rolePermissions, eq(rolePermissions.permissionId, permissions.id))
      .innerJoin(userRoles, eq(userRoles.roleId, rolePermissions.roleId))
      .where(eq(userRoles.userId, userId));
  }

  public async countById(id: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(permissions).where(eq(permissions.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(permissions)
      .where(eq(permissions.id, id))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(permissions).where(eq(permissions.code, code));
    return result[0]?.value || 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(permissions)
      .where(eq(permissions.code, code))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(permission: PermissionSave): Promise<PermissionDTO | undefined> {
    const result = await db.main.insert(permissions).values(permission).returning(selectAll);
    return result[0];
  }

  public async update(request: PermissionSaveDTO): Promise<PermissionDTO | undefined> {
    const result = await db.main
      .update(permissions)
      .set({ name: request.name, description: request.description })
      .where(eq(permissions.id, request.id || ""))
      .returning(selectAll);
    return result[0];
  }
}

export const permissionRepository = new PermissionRepository();
