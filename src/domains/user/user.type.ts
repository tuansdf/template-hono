import { UserTable } from "~/domains/user/user.entity.js";

export type UserSearchRequestDTO = {
  email: string;
  username: string;
};

export type User = typeof UserTable.$inferSelect;
export type UserSave = typeof UserTable.$inferInsert;
