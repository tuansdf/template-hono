import { and, count, eq, gte, sql } from "drizzle-orm";
import { STATUS } from "@/constants/status.constant";
import { db } from "@/db/db";
import { TokenDTO, TokenSave } from "@/domains/token/token.type";
import { tokenTable } from "@/db/schemas/token.schema";

const selectAll = {
  id: tokenTable.id,
  foreignId: tokenTable.foreignId,
  value: tokenTable.value,
  type: tokenTable.type,
  expiresAt: tokenTable.expiresAt,
  status: tokenTable.status,
  createdBy: tokenTable.createdBy,
  updatedBy: tokenTable.updatedBy,
  createdAt: tokenTable.createdAt,
  updatedAt: tokenTable.updatedAt,
} as const;

class TokenRepository {
  public async findAll(): Promise<TokenDTO[]> {
    return db.main.select(selectAll).from(tokenTable);
  }

  public async findTopById(id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(tokenTable).where(eq(tokenTable.id, id)).limit(1);
    return result[0];
  }

  public async findTopByValueAndForeignId(value: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokenTable)
      .where(and(eq(tokenTable.value, value), eq(tokenTable.foreignId, foreignId)))
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
      .from(tokenTable)
      .where(and(eq(tokenTable.value, value), eq(tokenTable.foreignId, foreignId), eq(tokenTable.status, status)))
      .limit(1);
    return result[0];
  }

  public async findTopByIdAndForeignId(id: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokenTable)
      .where(and(eq(tokenTable.id, id), eq(tokenTable.foreignId, foreignId)))
      .limit(1);
    return result[0];
  }

  public async findTopByValue(token: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(tokenTable).where(eq(tokenTable.value, token)).limit(1);
    return result[0];
  }

  public async findTopByValueAndStatus(token: string, status: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokenTable)
      .where(and(eq(tokenTable.value, token), eq(tokenTable.status, status)))
      .limit(1);
    return result[0];
  }

  public async findOneByForeignIdAndTypeAndStatusAndCreatedAtAfter(
    foreignId: string,
    type: string,
    status: string,
    createdAt: Date,
  ) {
    const result = await db.main
      .select(selectAll)
      .from(tokenTable)
      .where(
        and(
          eq(tokenTable.foreignId, foreignId),
          eq(tokenTable.type, type),
          eq(tokenTable.status, status),
          gte(tokenTable.createdAt, createdAt),
        ),
      )
      .limit(1);
    return result[0];
  }

  public async deactivateAllByForeignIdAndTypeAndStatus(foreignId: string, type: string, status: string) {
    await db.main
      .update(tokenTable)
      .set({ status: STATUS.INACTIVE })
      .where(and(eq(tokenTable.foreignId, foreignId), eq(tokenTable.type, type), eq(tokenTable.status, status)));
  }

  public async countByValue(token: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(tokenTable).where(eq(tokenTable.value, token));
    return result[0]?.value || 0;
  }

  public async existByValue(token: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(tokenTable)
      .where(eq(tokenTable.value, token))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(data: TokenSave): Promise<TokenDTO | undefined> {
    const result = await db.main.insert(tokenTable).values(data).returning(selectAll);
    return result[0];
  }

  public async saveAll(data: TokenSave[]): Promise<void> {
    await db.main.insert(tokenTable).values(data);
  }

  public async updateValueByTokenId(value: string, id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.update(tokenTable).set({ value }).where(eq(tokenTable.id, id)).returning(selectAll);
    return result[0];
  }

  public async updateStatusByTokenIdAndForeignId(status: string, tokenId: string, foreignId: string): Promise<void> {
    await db.main
      .update(tokenTable)
      .set({ status })
      .where(and(eq(tokenTable.id, tokenId), eq(tokenTable.foreignId, foreignId)));
  }

  public async updateStatusByForeignId(status: string, foreignId: string): Promise<void> {
    await db.main.update(tokenTable).set({ status }).where(eq(tokenTable.foreignId, foreignId));
  }
}

export const tokenRepository = new TokenRepository();
