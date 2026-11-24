import { type UserResponse } from "./users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, getBearerToken, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken, revokeRefreshToken, userForRefreshToken } from "../db/queries/refresh_tokens.js";
import { respondWithJSON } from "./json.js";
import { makeJWT } from "../auth.js";

import { type Request, type Response } from "express";
import { config } from "../config.js";


type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
}

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    }

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields")
    }

    const user = await getUserByEmail(params.email);
    const authorized = await checkPasswordHash(params.password, user.hashedPassword)
    if (!user || !authorized) {
        throw new UserNotAuthenticatedError("incorrect email or password")
    }

    const access = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refresh = makeRefreshToken();
    const refreshToken = await createRefreshToken(refresh, user.id);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
        token: access,
        refreshToken: refreshToken.token
    } satisfies LoginResponse);
}

export async function handlerRefreshAccessToken(req: Request, res: Response) {
    const tokenStr = getBearerToken(req);
    const refreshToken = await userForRefreshToken(tokenStr);

    const revoked = refreshToken.revokedAt ? refreshToken.revokedAt < new Date(Date.now()) : false;
    if (!refreshToken || revoked) {
        throw new UserNotAuthenticatedError("Invalid refresh token");
    }

    const access = makeJWT(refreshToken.userId, config.jwt.defaultDuration, config.jwt.secret);

    type response = {
        token: string;
    };

    respondWithJSON(res, 200, {
        token: access
    } satisfies response);
}

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
    const tokenStr = getBearerToken(req);
    await revokeRefreshToken(tokenStr);

    res.status(204).send();
}
