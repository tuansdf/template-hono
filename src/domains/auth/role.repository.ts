import { eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { MapUserRoleTable } from "~/entities/map-user-role.entity.js";
import { RoleTable } from "~/entities/role.entity.js";

export class RoleRepository {
  static async findAll() {
    return db.select().from(RoleTable);
  }

  static async findAllByUserId(userId: number) {
    return db
      .select({
        id: RoleTable.id,
        code: RoleTable.code,
        b: RoleTable.b,
      })
      .from(RoleTable)
      .innerJoin(MapUserRoleTable, eq(MapUserRoleTable.roleId, RoleTable.id))
      .where(eq(MapUserRoleTable.userId, userId));
  }
}
