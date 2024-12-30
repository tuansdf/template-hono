import { and, count, eq, or, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { UserDTO, UserSave } from "@/domains/user/user.type";
import { users } from "@/db/schemas/user.schema";

export const userSelector = {
  all: {
    id: users.id,
    name: users.name,
    email: users.email,
    username: users.username,
    password: users.password,
    status: users.status,
    createdBy: users.createdBy,
    updatedBy: users.updatedBy,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  },
  search: {
    id: users.id,
    name: users.name,
    email: users.email,
    username: users.username,
    status: users.status,
  },
} as const;

class UserRepository {
  public async findAll(): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(users);
  }

  public async findAllByStatus(status: string): Promise<UserDTO[]> {
    return db.main.select(userSelector.all).from(users).where(eq(users.status, status));
  }

  public async findTopById(id: string): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmailWithPassword(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsernameOrEmail(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);
    return result[0];
  }

  public async findTopByUsername(username: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  public async findTopByEmail(email: string): Promise<UserDTO | undefined> {
    const result = await db.main.select(userSelector.all).from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  public async findTopByEmailAndStatus(email: string, status: string): Promise<UserDTO | undefined> {
    const result = await db.main
      .select(userSelector.all)
      .from(users)
      .where(and(eq(users.email, email), eq(users.status, status)))
      .limit(1);
    return result[0];
  }

  public async countByUsername(username: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(users).where(eq(users.username, username));
    return result[0]?.value || 0;
  }

  public async countByUsernameOrEmail(username: string): Promise<number> {
    const result = await db.main
      .select({ value: count() })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)));
    return result[0]?.value || 0;
  }

  public async existByUsernameOrEmail(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);
    return !!result[0]?.value;
  }

  public async existByUsername(username: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return !!result[0]?.value;
  }

  public async countByEmail(email: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(users).where(eq(users.email, email));
    return result[0]?.value || 0;
  }

  public async existByEmail(email: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(user: UserSave): Promise<UserDTO | undefined> {
    const result = await db.main.insert(users).values(user).returning(userSelector.all);
    return result[0];
  }

  public async saveAll(users: UserSave[]): Promise<void> {
    await db.main.insert(users).values(users);
  }
}

export const userRepository = new UserRepository();
