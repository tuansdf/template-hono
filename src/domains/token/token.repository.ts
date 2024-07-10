import { and, count, eq } from "drizzle-orm";
import { db } from "~/database/db";
import { TokenSave } from "~/domains/token/token.type";
import { TokenTable } from "~/entities/token.entity";

class TokenRepository {
  public async findAll() {
    return db.main.select().from(TokenTable);
  }

  public async findTopById(id: number) {
    const result = await db.main.select().from(TokenTable).where(eq(TokenTable.id, id));
    return result?.[0];
  }

  public async findTopByValueAndForeignId(value: string, foreignId: number) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId)));
    return result?.[0];
  }

  public async findTopByValueAndForeignIdAndStatus(value: string, foreignId: number, status: string) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId), eq(TokenTable.status, status)));
    return result?.[0];
  }

  public async findTopByIdAndForeignId(id: number, foreignId: number) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.id, id), eq(TokenTable.foreignId, foreignId)));
    return result?.[0];
  }

  public async findTopByValue(token: string) {
    const result = await db.main.select().from(TokenTable).where(eq(TokenTable.value, token));
    return result?.[0];
  }

  public async findTopByValueAndStatus(token: string, status: string) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, token), eq(TokenTable.status, status)));
    return result?.[0];
  }

  public async countByValue(token: string) {
    const result = await db.main.select({ value: count() }).from(TokenTable).where(eq(TokenTable.value, token));
    return result?.[0]?.value || 0;
  }

  public async existByValue(username: string) {
    const result = await this.countByValue(username);
    return result > 0;
  }

  public async save(data: TokenSave) {
    const result = await db.main.insert(TokenTable).values(data).returning();
    return result[0]!;
  }

  public async saveAll(data: TokenSave[]) {
    return db.main.insert(TokenTable).values(data);
  }

  public updateValueByTokenId = async (value: string, id: number) => {
    await db.main.update(TokenTable).set({ value }).where(eq(TokenTable.id, id));
  };

  public updateStatusByTokenIdAndForeignId = async (status: string, tokenId: number, foreignId: number) => {
    await db.main
      .update(TokenTable)
      .set({ status })
      .where(and(eq(TokenTable.id, tokenId), eq(TokenTable.foreignId, foreignId)));
  };

  public updateStatusByForeignId = async (status: string, foreignId: number) => {
    await db.main.update(TokenTable).set({ status }).where(eq(TokenTable.foreignId, foreignId));
  };
}

export const tokenRepository = new TokenRepository();
