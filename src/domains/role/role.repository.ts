import { count, eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { RoleSave, RoleUpdate } from "~/domains/role/role.type.js";
import { MapUserRoleTable } from "~/entities/map-user-role.entity.js";
import { RoleTable } from "~/entities/role.entity.js";

const commonSelect = {
  id: RoleTable.id,
  code: RoleTable.code,
  name: RoleTable.name,
  description: RoleTable.description,
};

export class RoleRepository {
  static async findAll() {
    return db.select(commonSelect).from(RoleTable);
  }

  static async findAllByUserId(userId: number) {
    return db
      .select(commonSelect)
      .from(RoleTable)
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, RoleTable.id))
      .where(eq(MapUserRoleTable.userId, userId));
  }

  static async findTopById(id: number) {
    const result = await db.select(commonSelect).from(RoleTable).where(eq(RoleTable.id, id)).limit(1);
    return result?.[0];
  }

  static async countByCode(code: string) {
    const result = await db.select({ value: count() }).from(RoleTable).where(eq(RoleTable.code, code));
    return result?.[0]?.value || 0;
  }

  static async countById(id: number) {
    const result = await db.select({ value: count() }).from(RoleTable).where(eq(RoleTable.id, id));
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

  static async save(role: RoleSave) {
    const saved = await db.insert(RoleTable).values(role).returning(commonSelect);
    return saved[0]!;
  }

  static async update(request: RoleUpdate) {
    await db
      .update(RoleTable)
      .set({ name: request.name, description: request.description })
      .where(eq(RoleTable.id, Number(request.id)));
  }
}
