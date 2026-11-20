import { refreshTokens } from "../schema.js";
import { db } from "../index.js";
import { config } from "../../config.js";


export async function createRefreshToken(token: string, userId: string) {
    const [result] = await db.insert(refreshTokens).values({
        token: token,
        userId: userId,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration)
    }).returning();
    return result;
}
