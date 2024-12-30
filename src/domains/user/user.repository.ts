import { and, count, eq, or, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { UserDTO, UserSave } from "@/domains/user/user.type";
import { userTable } from "@/db/schemas/user.schema";

export const userSelector = {
  all: {
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
    username: userTable.username,
    password: userTable.password,
    status: userTable.status,
    createdBy: userTable.createdBy,
    updatedBy: userTable.updatedBy,
    createdAt: userTable.createdAt,
    updatedAt: userTable.updatedAt,
  },
  search: {
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
    username: userTable.username,
    status: userTable.status,
  },
} as const;

class UserRepository {
  public async findAll(): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(userTable);
  }

  public async findAllByStatus(status: string): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(userTable).where(eq(userTable.status, status));
  }

  public async findTopById(id: string): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(userTable).where(eq(userTable.id, id)).limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmailWithPassword(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(userTable)
      .where(or(eq(userTable.username, username), eq(userTable.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmail(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(userTable)
      .where(or(eq(userTable.username, username), eq(userTable.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsername(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);
    return result[0];
  }

  public async findTopByEmail(email: string): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(userTable).where(eq(userTable.email, email)).limit(1);
    return result[0];
  }

  public async findTopByEmailAndStatus(email: string, status: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(userTable)
      .where(and(eq(userTable.email, email), eq(userTable.status, status)))
      .limit(1);
    return result[0];
  }

  public async countByUsername(username: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(userTable).where(eq(userTable.username, username));
    return result[0]?.value || 0;
  }

  public async countByUsernameOrEmail(username: string): Promise<number> {
    const result = await db.main
      .select({ value: count() })
      .from(userTable)
      .where(or(eq(userTable.username, username), eq(userTable.email, username)));
    return result[0]?.value || 0;
  }

  public async existByUsernameOrEmail(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(userTable)
      .where(or(eq(userTable.username, username), eq(userTable.email, username)))
      .limit(1);
    return !!result[0]?.value;
  }

  public async existByUsername(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByEmail(email: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(userTable).where(eq(userTable.email, email));
    return result[0]?.value || 0;
  }

  public async existByEmail(email: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(user: UserSave): Promise<UserDTO | undefined> {
    const result = await db.main.insert(userTable).values(user).returning(userSelector.all);
    return result[0];
  }

  public async saveAll(users: UserSave[]): Promise<void> {
    await db.main.insert(userTable).values(users);
  }
}

export const userRepository = new UserRepository();
