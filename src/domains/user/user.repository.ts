import { count, eq, or } from "drizzle-orm";
import { db } from "~/database/db.js";
import { UserSave } from "~/domains/user/user.type.js";
import { UserTable } from "~/entities/user.entity.js";

export const userPasswordSelect = {
  id: UserTable.id,
  email: UserTable.email,
  username: UserTable.username,
  password: UserTable.password,
  status: UserTable.status,
  tokenNbf: UserTable.tokenNbf,
};

export const userCommonSelect = {
  id: UserTable.id,
  email: UserTable.email,
  username: UserTable.username,
  status: UserTable.status,
};

export class UserRepository {
  static async findAll() {
    return db.select(userCommonSelect).from(UserTable);
  }

  static async findTopById(id: number) {
    const users = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.id, id)).limit(1);
    return users?.[0];
  }

  static async findTopByUsernameOrEmailWithPassword(username: string) {
    const users = await db
      .select(userPasswordSelect)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return users?.[0];
  }

  static async findTopByUsername(username: string) {
    const users = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.username, username)).limit(1);
    return users?.[0];
  }

  static async findTopByEmail(email: string) {
    const users = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.email, email)).limit(1);
    return users?.[0];
  }

  static async countByUsername(username: string) {
    const userCount = await db.select({ value: count() }).from(UserTable).where(eq(UserTable.username, username));
    return userCount?.[0]?.value || 0;
  }

  static async existByUsername(username: string) {
    const userCount = await this.countByUsername(username);
    return userCount > 0;
  }

  static async countByEmail(email: string) {
    const userCount = await db.select({ value: count() }).from(UserTable).where(eq(UserTable.email, email));
    return userCount?.[0]?.value || 0;
  }

  static async existByEmail(email: string) {
    const userCount = await this.countByEmail(email);
    return userCount > 0;
  }

  static async save(user: UserSave) {
    const saved = await db.insert(UserTable).values(user).returning(userCommonSelect);
    return saved[0]!;
  }

  static async saveAll(users: UserSave[]) {
    return db.insert(UserTable).values(users);
  }
}
