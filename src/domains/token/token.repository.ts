import { and, count, eq, gte, sql } from "drizzle-orm";
import { STATUS } from "@/constants/status.constant";
import { db } from "@/db/db";
import { TokenDTO, TokenSave } from "@/domains/token/token.type";
import { tokens } from "@/db/schemas/token.schema";

const selectAll = {
  id: tokens.id,
  foreignId: tokens.foreignId,
  value: tokens.value,
  type: tokens.type,
  expiresAt: tokens.expiresAt,
  status: tokens.status,
  createdBy: tokens.createdBy,
  updatedBy: tokens.updatedBy,
  createdAt: tokens.createdAt,
  updatedAt: tokens.updatedAt,
} as const;

class TokenRepository {
  public async findAll(): Promise<TokenDTO[]> {
    return db.main.select(selectAll).from(tokens);
  }

  public async findTopById(id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(tokens).where(eq(tokens.id, id)).limit(1);
    return result[0];
  }

  public async findTopByValueAndForeignId(value: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokens)
      .where(and(eq(tokens.value, value), eq(tokens.foreignId, foreignId)))
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
      .from(tokens)
      .where(and(eq(tokens.value, value), eq(tokens.foreignId, foreignId), eq(tokens.status, status)))
      .limit(1);
    return result[0];
  }

  public async findTopByIdAndForeignId(id: string, foreignId: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokens)
      .where(and(eq(tokens.id, id), eq(tokens.foreignId, foreignId)))
      .limit(1);
    return result[0];
  }

  public async findTopByValue(token: string): Promise<TokenDTO | undefined> {
    const result = await db.main.select(selectAll).from(tokens).where(eq(tokens.value, token)).limit(1);
    return result[0];
  }

  public async findTopByValueAndStatus(token: string, status: string): Promise<TokenDTO | undefined> {
    const result = await db.main
      .select(selectAll)
      .from(tokens)
      .where(and(eq(tokens.value, token), eq(tokens.status, status)))
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
      .from(tokens)
      .where(
        and(
          eq(tokens.foreignId, foreignId),
          eq(tokens.type, type),
          eq(tokens.status, status),
          gte(tokens.createdAt, createdAt),
        ),
      )
      .limit(1);
    return result[0];
  }

  public async deactivateAllByForeignIdAndTypeAndStatus(foreignId: string, type: string, status: string) {
    await db.main
      .update(tokens)
      .set({ status: STATUS.INACTIVE })
      .where(and(eq(tokens.foreignId, foreignId), eq(tokens.type, type), eq(tokens.status, status)));
  }

  public async countByValue(token: string): Promise<number> {
    const result = await db.main.select({ value: count() }).from(tokens).where(eq(tokens.value, token));
    return result[0]?.value || 0;
  }

  public async existByValue(token: string): Promise<boolean> {
    const result = await db.main
      .select({ value: sql`1` })
      .from(tokens)
      .where(eq(tokens.value, token))
      .limit(1);
    return !!result[0]?.value;
  }

  public async save(data: TokenSave): Promise<TokenDTO | undefined> {
    const result = await db.main.insert(tokens).values(data).returning(selectAll);
    return result[0];
  }

  public async saveAll(data: TokenSave[]): Promise<void> {
    await db.main.insert(tokens).values(data);
  }

  public async updateValueByTokenId(value: string, id: string): Promise<TokenDTO | undefined> {
    const result = await db.main.update(tokens).set({ value }).where(eq(tokens.id, id)).returning(selectAll);
    return result[0];
  }

  public async updateStatusByTokenIdAndForeignId(status: string, tokenId: string, foreignId: string): Promise<void> {
    await db.main
      .update(tokens)
      .set({ status })
      .where(and(eq(tokens.id, tokenId), eq(tokens.foreignId, foreignId)));
  }

  public async updateStatusByForeignId(status: string, foreignId: string): Promise<void> {
    await db.main.update(tokens).set({ status }).where(eq(tokens.foreignId, foreignId));
  }
}

export const tokenRepository = new TokenRepository();
