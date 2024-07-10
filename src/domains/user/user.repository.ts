import { count, eq, or } from "drizzle-orm";
import { db } from "~/database/db";
import { UserSave } from "~/domains/user/user.type";
import { UserTable } from "~/entities/user.entity";

export const userSelector = {
  all: {
    id: UserTable.id,
    name: UserTable.name,
    email: UserTable.email,
    username: UserTable.username,
    password: UserTable.password,
    status: UserTable.status,
    createdBy: UserTable.createdBy,
    updatedBy: UserTable.updatedBy,
    createdAt: UserTable.createdAt,
    updatedAt: UserTable.updatedAt,
  },
  search: {
    id: UserTable.id,
    name: UserTable.name,
    email: UserTable.email,
    username: UserTable.username,
    status: UserTable.status,
  },
} as const;

class UserRepository {
  public async findAll() {
    return db.main.select(userSelector.all).from(UserTable);
  }

  public async findAllByStatus(status: string) {
    return db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.status, status));
  }

  public async findTopById(id: number) {
    const result = await db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.id, id)).limit(1);
    return result?.[0];
  }

  public async findTopByUsernameOrEmailWithPassword(username: string) {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result?.[0];
  }

  public async findTopByUsernameOrEmail(username: string) {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result?.[0];
  }

  public async findTopByUsername(username: string) {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(eq(UserTable.username, username))
      .limit(1);
    return result?.[0];
  }

  public async findTopByEmail(email: string) {
    const result = await db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.email, email)).limit(1);
    return result?.[0];
  }

  public async countByUsername(username: string) {
    const result = await db.main.select({ value: count() }).from(UserTable).where(eq(UserTable.username, username));
    return result?.[0]?.value || 0;
  }

  public async countByUsernameOrEmail(username: string) {
    const result = await db.main
      .select({ value: count() })
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)));
    return result?.[0]?.value || 0;
  }

  public async existByUsernameOrEmail(username: string) {
    const result = await this.countByUsernameOrEmail(username);
    return result > 0;
  }

  public async existByUsername(username: string) {
    const result = await this.countByUsername(username);
    return result > 0;
  }

  public async countByEmail(email: string) {
    const result = await db.main.select({ value: count() }).from(UserTable).where(eq(UserTable.email, email));
    return result?.[0]?.value || 0;
  }

  public async existByEmail(email: string) {
    const result = await this.countByEmail(email);
    return result > 0;
  }

  public async save(user: UserSave) {
    const result = await db.main.insert(UserTable).values(user).returning(userSelector.all);
    return result[0]!;
  }

  public async saveAll(users: UserSave[]) {
    return db.main.insert(UserTable).values(users);
  }
}

export const userRepository = new UserRepository();
