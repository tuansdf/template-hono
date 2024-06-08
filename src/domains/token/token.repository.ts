import { and, count, eq } from "drizzle-orm";
import { db } from "~/database/db";
import { TokenSave } from "~/domains/token/token.type";
import { TokenTable } from "~/entities/token.entity";

export class TokenRepository {
  static async findAll() {
    return db.main.select().from(TokenTable);
  }

  static async findTopById(id: number) {
    const result = await db.main.select().from(TokenTable).where(eq(TokenTable.id, id));
    return result?.[0];
  }

  static async findTopByValueAndForeignId(value: string, foreignId: number) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId)));
    return result?.[0];
  }

  static async findTopByValueAndForeignIdAndStatus(value: string, foreignId: number, status: string) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, value), eq(TokenTable.foreignId, foreignId), eq(TokenTable.status, status)));
    return result?.[0];
  }

  static async findTopByIdAndForeignId(id: number, foreignId: number) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.id, id), eq(TokenTable.foreignId, foreignId)));
    return result?.[0];
  }

  static async findTopByValue(token: string) {
    const result = await db.main.select().from(TokenTable).where(eq(TokenTable.value, token));
    return result?.[0];
  }

  static async findTopByValueAndStatus(token: string, status: string) {
    const result = await db.main
      .select()
      .from(TokenTable)
      .where(and(eq(TokenTable.value, token), eq(TokenTable.status, status)));
    return result?.[0];
  }

  static async countByValue(token: string) {
    const result = await db.main.select({ value: count() }).from(TokenTable).where(eq(TokenTable.value, token));
    return result?.[0]?.value || 0;
  }

  static async existByValue(username: string) {
    const result = await this.countByValue(username);
    return result > 0;
  }

  static async save(data: TokenSave) {
    const result = await db.main.insert(TokenTable).values(data).returning();
    return result[0]!;
  }

  static async saveAll(data: TokenSave[]) {
    return db.main.insert(TokenTable).values(data);
  }

  static updateValueByTokenId = async (value: string, id: number) => {
    await db.main.update(TokenTable).set({ value }).where(eq(TokenTable.id, id));
  };

  static updateStatusByTokenIdAndForeignId = async (status: string, tokenId: number, foreignId: number) => {
    await db.main
      .update(TokenTable)
      .set({ status })
      .where(and(eq(TokenTable.id, tokenId), eq(TokenTable.foreignId, foreignId)));
  };

  static updateStatusByForeignId = async (status: string, foreignId: number) => {
    await db.main.update(TokenTable).set({ status }).where(eq(TokenTable.foreignId, foreignId));
  };
}
