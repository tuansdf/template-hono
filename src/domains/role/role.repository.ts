import { count, eq } from "drizzle-orm";
import { db } from "~/database/db";
import { RoleSave, RoleUpdate } from "~/domains/role/role.type";
import { MapUserRoleTable } from "~/entities/map-user-role.entity";
import { RoleTable } from "~/entities/role.entity";

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
  public async findAll() {
    return db.main.select(selectAll).from(RoleTable);
  }

  public async findAllByUserId(userId: number) {
    return db.main
      .select(selectAll)
      .from(RoleTable)
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, RoleTable.id))
      .where(eq(MapUserRoleTable.userId, userId));
  }

  public async findTopById(id: number) {
    const result = await db.main.select(selectAll).from(RoleTable).where(eq(RoleTable.id, id)).limit(1);
    return result?.[0];
  }

  public async countByCode(code: string) {
    const result = await db.main.select({ value: count() }).from(RoleTable).where(eq(RoleTable.code, code));
    return result?.[0]?.value || 0;
  }

  public async countById(id: number) {
    const result = await db.main.select({ value: count() }).from(RoleTable).where(eq(RoleTable.id, id));
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

  public async save(role: RoleSave) {
    const saved = await db.main.insert(RoleTable).values(role).returning(selectAll);
    return saved[0]!;
  }

  public async update(request: RoleUpdate) {
    await db.main
      .update(RoleTable)
      .set({ name: request.name, description: request.description })
      .where(eq(RoleTable.id, Number(request.id)));
  }
}

export const roleRepository = new RoleRepository();
