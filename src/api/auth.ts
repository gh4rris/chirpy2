import { type UserResponse } from "../db/schema.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { makeJWT } from "../auth.js";

import { type Request, type Response } from "express";
import { config } from "../config.js";


type LoginResponse = UserResponse & {
    token: string;
}

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
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

    let expiresIn = config.jwt.defaultDuration;
    if (params.expiresInSeconds && params.expiresInSeconds < config.jwt.defaultDuration) {
        expiresIn = params.expiresInSeconds;
    } 

    const token = makeJWT(user.id, expiresIn, config.jwt.secret);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    } satisfies LoginResponse);
}

