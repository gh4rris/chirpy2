import { refreshTokens } from "../schema.js";
import { db } from "../index.js";
import { config } from "../../config.js";
import { eq } from "drizzle-orm";


export async function createRefreshToken(token: string, userId: string) {
    const [result] = await db.insert(refreshTokens).values({
        token: token,
        userId: userId,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration)
    }).returning();
    return result;
}

export async function userForRefreshToken(token: string) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token))
    return result;
}

export async function revokeRefreshToken(token: string) {
    await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.token, token));
}
