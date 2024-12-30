import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { RoleDTO, RoleSave, RoleSaveDTO } from "@/domains/role/role.type";
import { roles } from "@/db/schemas/role.schema";
import { userRoles } from "@/db/schemas/user-role.schema";

const selectAll = {
  id: roles.id,
  code: roles.code,
  name: roles.name,
  description: roles.description,
  status: roles.status,
  createdBy: roles.createdBy,
  updatedBy: roles.updatedBy,
  createdAt: roles.createdAt,
  updatedAt: roles.updatedAt,
} as const;

class RoleRepository {
  public async findAll(): Promise<RoleDTO[]> {
    return db.main.select(selectAll).from(roles);
  }

  public async findAllByUserId(userId: string): Promise<RoleDTO[]> {
    return db.main
      .select(selectAll)
      .from(roles)
      .innerJoin(userRoles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
  }

  public async findTopById(id: string): Promise<RoleDTO | undefined> {
    const result = await db.main.select(selectAll).from(roles).where(eq(roles.id, id)).limit(1);
    return result[0];
  }

  public async countById(id: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(roles).where(eq(roles.id, id));
    return result[0]?.value || 0;
  }

  public async existById(id: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByCode(code: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(roles).where(eq(roles.code, code));
    return result[0]?.value || 0;
  }

  public async existByCode(code: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(roles)
      .where(eq(roles.code, code))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(role: RoleSave): Promise<RoleDTO | undefined> {
    const result = await db.main.insert(roles).values(role).returning(selectAll);
    return result[0];
  }

  public async update(request: RoleSaveDTO): Promise<RoleDTO | undefined> {
    const result = await db.main
      .update(roles)
      .set({ name: request.name, description: request.description })
      .where(eq(roles.id, request.id || ""))
      .returning(selectAll);
    return result[0];
  }
}

export const roleRepository = new RoleRepository();
