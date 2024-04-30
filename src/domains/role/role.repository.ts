import { eq } from "drizzle-orm";
import { db } from "~/database/db.js";
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
}
