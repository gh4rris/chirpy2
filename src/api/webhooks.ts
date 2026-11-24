import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { config } from "../config.js";
import { updateUserToChirpyRed } from "../db/queries/users.js"
import { getAPIKey } from "../auth.js";

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

    const token = getAPIKey(req);
    if (token !== config.api.polkaKey) {
        throw new UserNotAuthenticatedError("Invalid token");
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
