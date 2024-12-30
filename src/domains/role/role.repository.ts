import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { RoleDTO, RoleSave, RoleSaveDTO } from "@/domains/role/role.type";
import { roleTable } from "@/db/schemas/role.schema";
import { userRoleTable } from "@/db/schemas/user-role.schema";

const selectAll = {
  id: roleTable.id,
  code: roleTable.code,
  name: roleTable.name,
  description: roleTable.description,
  status: roleTable.status,
  createdBy: roleTable.createdBy,
  updatedBy: roleTable.updatedBy,
  createdAt: roleTable.createdAt,
  updatedAt: roleTable.updatedAt,
} as const;

class RoleRepository {
  public async findAll(): Promise<RoleDTO[]> {
    return db.main.select(selectAll).from(roleTable);
  }

  public async findAllByUserId(userId: string): Promise<RoleDTO[]> {
    return db.main
      .select(selectAll)
      .from(roleTable)
      .innerJoin(userRoleTable, eq(userRoleTable.roleId, roleTable.id))
      .where(eq(userRoleTable.userId, userId));
  }

  public async findTopById(id: string): Promise<RoleDTO | undefined> {
    const result = await db.main.select(selectAll).from(roleTable).where(eq(roleTable.id, id)).limit(1);
    return result[0];
  }

  public async countById(id: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(roleTable).where(eq(roleTable.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(roleTable)
      .where(eq(roleTable.id, id))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(roleTable).where(eq(roleTable.code, code));
    return result[0]?.value || 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(roleTable)
      .where(eq(roleTable.code, code))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(role: RoleSave): Promise<RoleDTO | undefined> {
    const result = await db.main.insert(roleTable).values(role).returning(selectAll);
    return result[0];
  }

  public async update(request: RoleSaveDTO): Promise<RoleDTO | undefined> {
    const result = await db.main
      .update(roleTable)
      .set({ name: request.name, description: request.description })
      .where(eq(roleTable.id, request.id || ""))
      .returning(selectAll);
    return result[0];
  }
}

export const roleRepository = new RoleRepository();
