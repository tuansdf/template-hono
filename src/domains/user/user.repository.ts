import { count, eq } from "drizzle-orm";
import { db } from "~/database/db.js";
import { UserTable } from "~/domains/user/user.entity.js";
import { User } from "~/domains/user/user.type.js";

export class UserRepository {
  static async findAll() {
    return db.select().from(UserTable);
  }

  static async findTopById(id: number) {
    const users = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, id))
      .limit(1);
    return users?.[0];
  }

  static async findTopByUsername(username: string) {
    const users = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.username, username))
      .limit(1);
    return users?.[0];
  }

  static async findTopByEmail(email: string) {
    const users = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);
    return users?.[0];
  }

  static async countByUsername(username: string) {
    const userCount = await db
      .select({ value: count() })
      .from(UserTable)
      .where(eq(UserTable.username, username));
    return userCount?.[0]?.value || 0;
  }

  static async existByUsername(username: string) {
    const userCount = await this.countByUsername(username);
    return userCount > 0;
  }

  static async countByEmail(email: string) {
    const userCount = await db
      .select({ value: count() })
      .from(UserTable)
      .where(eq(UserTable.email, email));
    return userCount?.[0]?.value || 0;
  }

  static async existByEmail(email: string) {
    const userCount = await this.countByEmail(email);
    return userCount > 0;
  }

  static async save(user: Partial<User>) {
    const saved = await db.insert(UserTable).values(user).returning();
    return saved[0]!;
  }

  static async saveAll(users: User[]) {
    return db.insert(UserTable).values(users);
  }
}
