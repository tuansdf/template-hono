import { count, eq, or, sql } from "drizzle-orm";
import { db } from "~/database/db";
import { UserDTO, UserSave } from "~/domains/user/user.type";
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
  public async findAll(): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(UserTable);
  }

  public async findAllByStatus(status: string): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.status, status));
  }

  public async findTopById(id: number): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.id, id)).limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmailWithPassword(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmail(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsername(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(UserTable)
      .where(eq(UserTable.username, username))
      .limit(1);
    return result[0];
  }

  public async findTopByEmail(email: string): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(UserTable).where(eq(UserTable.email, email)).limit(1);
    return result[0];
  }

  public async countByUsername(username: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(UserTable).where(eq(UserTable.username, username));
    return result[0]?.value || 0;
  }

  public async countByUsernameOrEmail(username: string): Promise<number> {
    const result = await db.main
      .select({ value: count() })
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)));
    return result[0]?.value || 0;
  }

  public async existByUsernameOrEmail(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(UserTable)
      .where(or(eq(UserTable.username, username), eq(UserTable.email, username)))
      .limit(1);
    return !!result[0]?.value;
  }

  public async existByUsername(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(UserTable)
      .where(eq(UserTable.username, username))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByEmail(email: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(UserTable).where(eq(UserTable.email, email));
    return result[0]?.value || 0;
  }

  public async existByEmail(email: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(user: UserSave): Promise<UserDTO | undefined> {
    const result = await db.main.insert(UserTable).values(user).returning(userSelector.all);
    return result[0];
  }

  public async saveAll(users: UserSave[]): Promise<void> {
    await db.main.insert(UserTable).values(users);
  }
}

export const userRepository = new UserRepository();
