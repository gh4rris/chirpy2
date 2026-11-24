import { BadRequestError, NotFoundError } from "./errors.js";
import { updateUserToChirpyRed } from "../db/queries/users.js"

import { type Request, type Response } from "express";


export async function handlerPolkaWebhook(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: parameters = req.body;
    if (!params.event || !params.data) {
        throw new BadRequestError("Missing required fields");
    }

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return
    }

    const user = await updateUserToChirpyRed(params.data.userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    res.status(204).send();
}
