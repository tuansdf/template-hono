import { count, eq, sql } from "drizzle-orm";
import { db } from "~/db/db";
import { RoleDTO, RoleSave, RoleSaveDTO } from "~/domains/role/role.type";
import { RoleTable } from "~/entities/role.entity";
import { UserRoleTable } from "~/entities/user-role.entity";

const selectAll = {
  id: RoleTable.id,
  code: RoleTable.code,
  name: RoleTable.name,
  description: RoleTable.description,
  status: RoleTable.status,
  createdBy: RoleTable.createdBy,
  updatedBy: RoleTable.updatedBy,
  createdAt: RoleTable.createdAt,
  updatedAt: RoleTable.updatedAt,
} as const;

class RoleRepository {
  public async findAll(): Promise<RoleDTO[]> {
    return db.main.select(selectAll).from(RoleTable);
  }

  public async findAllByUserId(userId: string): Promise<RoleDTO[]> {
    return db.main
      .select(selectAll)
      .from(RoleTable)
      .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, RoleTable.id))
      .where(eq(UserRoleTable.userId, userId));
  }

  public async findTopById(id: string): Promise<RoleDTO | undefined> {
    const result = await db.main.select(selectAll).from(RoleTable).where(eq(RoleTable.id, id)).limit(1);
    return result[0];
  }

  public async countById(id: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(RoleTable).where(eq(RoleTable.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(RoleTable)
      .where(eq(RoleTable.id, id))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(RoleTable).where(eq(RoleTable.code, code));
    return result[0]?.value || 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(RoleTable)
      .where(eq(RoleTable.code, code))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(role: RoleSave): Promise<RoleDTO | undefined> {
    const result = await db.main.insert(RoleTable).values(role).returning(selectAll);
    return result[0];
  }

  public async update(request: RoleSaveDTO): Promise<RoleDTO | undefined> {
    const result = await db.main
      .update(RoleTable)
      .set({ name: request.name, description: request.description })
      .where(eq(RoleTable.id, request.id || ""))
      .returning(selectAll);
    return result[0];
  }
}

export const roleRepository = new RoleRepository();
