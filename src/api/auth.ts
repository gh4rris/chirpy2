import { BadRequestError, UnauthorizedError } from "./errors.js";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";

import { type Request, type Response } from "express";


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
        throw new UnauthorizedError("incorrect email or password")
    }

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    })
}

