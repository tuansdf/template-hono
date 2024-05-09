import { count, eq, or } from "drizzle-orm";
import { db } from "~/database/db.js";
import { UserSave } from "~/domains/user/user.type.js";
import { UserTable } from "~/entities/user.entity.js";

export const userPasswordSelect = {
  id: UserTable.id,
  name: UserTable.name,
  email: UserTable.email,
  username: UserTable.username,
  password: UserTable.password,
  status: UserTable.status,
  tokenNbf: UserTable.tokenNbf,
};

export const userCommonSelect = {
  id: UserTable.id,
  name: UserTable.name,
  email: UserTable.email,
  username: UserTable.username,
  status: UserTable.status,
};

export class UserRepository {
  static async findAll() {
    return db.select(userCommonSelect).from(UserTable);
  }

  static async findAllByStatus(status: string) {
    return db.select(userCommonSelect).from(UserTable).where(eq(UserTable.status, status));
  }

  static async findTopById(id: number) {
    const result = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.id, id)).limit(1);
    return result?.[0];
  }

  static async findTopByIdPrivate(id: number) {
    const result = await db.select(userPasswordSelect).from(UserTable).where(eq(UserTable.id, id)).limit(1);
    return result?.[0];
  }

  static async findTopByUsernameOrEmailWithPassword(username: string) {
    const result = await db
      .select(userPasswordSelect)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result?.[0];
  }

  static async findTopByUsernameOrEmail(username: string) {
    const result = await db
      .select(userCommonSelect)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result?.[0];
  }

  static async findTopByUsername(username: string) {
    const result = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.username, username)).limit(1);
    return result?.[0];
  }

  static async findTopByEmail(email: string) {
    const result = await db.select(userCommonSelect).from(UserTable).where(eq(UserTable.email, email)).limit(1);
    return result?.[0];
  }

  static async countByUsername(username: string) {
    const result = await db.select({ value: count() }).from(UserTable).where(eq(UserTable.username, username));
    return result?.[0]?.value || 0;
  }

  static async countByUsernameOrEmail(username: string) {
    const result = await db
      .select({ value: count() })
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)));
    return result?.[0]?.value || 0;
  }

  static async existByUsernameOrEmail(username: string) {
    const result = await this.countByUsernameOrEmail(username);
    return result > 0;
  }

  static async existByUsername(username: string) {
    const result = await this.countByUsername(username);
    return result > 0;
  }

  static async countByEmail(email: string) {
    const result = await db.select({ value: count() }).from(UserTable).where(eq(UserTable.email, email));
    return result?.[0]?.value || 0;
  }

  static async existByEmail(email: string) {
    const result = await this.countByEmail(email);
    return result > 0;
  }

  static async save(user: UserSave) {
    const result = await db.insert(UserTable).values(user).returning(userCommonSelect);
    return result[0]!;
  }

  static async saveAll(users: UserSave[]) {
    return db.insert(UserTable).values(users);
  }
}
