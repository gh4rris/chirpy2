import { type NewUser } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";

import { type Request, type Response } from "express";


export type UserResponse = Omit<NewUser, "hashedPassword">

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({
        email: params.email,
        hashedPassword: hashedPassword
    } satisfies NewUser);
    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    } satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await updateUser(userId, params.email, hashedPassword);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    } satisfies UserResponse)
}
