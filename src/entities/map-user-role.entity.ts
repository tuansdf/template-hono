import { bigint, bigserial, pgTable } from "drizzle-orm/pg-core";

export const MapUserRoleTable = pgTable("map_user_role", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }),
  roleId: bigint("role_id", { mode: "number" }),
});
