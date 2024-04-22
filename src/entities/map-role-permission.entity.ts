import { bigint, bigserial, pgTable } from "drizzle-orm/pg-core";

export const MapRolePermissionTable = pgTable("map_role_permission", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  roleId: bigint("role_id", { mode: "number" }),
  permissionId: bigint("permission_id", { mode: "number" }),
});
