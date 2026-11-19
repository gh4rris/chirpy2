import { type NewUser, type UserResponse } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";

import { type Request, type Response } from "express";


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

