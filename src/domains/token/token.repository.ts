import { and, count, eq, sql } from "drizzle-orm";
import { db } from "~/db/db";
import { TokenDTO, TokenSave } from "~/domains/token/token.type";
import { TokenTable } from "~/entities/token.entity";

const selectAll = {
  id: TokenTable.id,
  foreignId: TokenTable.foreignId,
  value: TokenTable.value,
  type: TokenTable.type,
  expiresAt: TokenTable.expiresAt,
  status: TokenTable.status,
  createdBy: TokenTable.createdBy,
  updatedBy: TokenTable.updatedBy,
  createdAt: TokenTable.createdAt,
  updatedAt: TokenTable.updatedAt,
} as const;

class TokenRepository {
  public async findAll(): Promise<TokenDTO[]> {
    return db.main.select(selectAll).from(TokenTable);
  }

  public async findTopById(id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(TokenTable).where(eq(TokenTable.id, id)).limit(1);
    return result[0];
  }

  public async findTopByValueAndForeignId(value: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId)))
      .limit(1);
    return result[0];
  }

  public async findTopByValueAndForeignIdAndStatus(
    value: string,
    foreignId: string,
    status: string,
  ): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId), eq(TokenTable.status, status)))
      .limit(1);
    return result[0];
  }

  public async findTopByIdAndForeignId(id: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(TokenTable)
      .where(and(eq(TokenTable.id, id), eq(TokenTable.foreignId, foreignId)))
      .limit(1);
    return result[0];
  }

  public async findTopByValue(token: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(TokenTable).where(eq(TokenTable.value, token)).limit(1);
    return result[0];
  }

  public async findTopByValueAndStatus(token: string, status: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(TokenTable)
      .where(and(eq(TokenTable.value, token), eq(TokenTable.status, status)))
      .limit(1);
    return result[0];
  }

  public async countByValue(token: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(TokenTable).where(eq(TokenTable.value, token));
    return result[0]?.value || 0;
  }

  public async existByValue(token: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(TokenTable)
      .where(eq(TokenTable.value, token))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(data: TokenSave): Promise<TokenDTO | undefined> {
    const result = await db.main.insert(TokenTable).values(data).returning(selectAll);
    return result[0];
  }

  public async saveAll(data: TokenSave[]): Promise<void> {
    await db.main.insert(TokenTable).values(data);
  }

  public async updateValueByTokenId(value: string, id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.update(TokenTable).set({ value }).where(eq(TokenTable.id, id)).returning(selectAll);
    return result[0];
  }

  public async updateStatusByTokenIdAndForeignId(status: string, tokenId: string, foreignId: string): Promise<void> {
    await db.main
      .update(TokenTable)
      .set({ status })
      .where(and(eq(TokenTable.id, tokenId), eq(TokenTable.foreignId, foreignId)));
  }

  public async updateStatusByForeignId(status: string, foreignId: string): Promise<void> {
    await db.main.update(TokenTable).set({ status }).where(eq(TokenTable.foreignId, foreignId));
  }
}

export const tokenRepository = new TokenRepository();
