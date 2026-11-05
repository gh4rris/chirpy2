import { config } from "../config.js";
import { type Request, type Response } from "express";
import { clearUsers } from "../db/queries/users.js";
import { ForbiddenError } from "./errors.js";


export async function handlerReset(_: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Reset is only allowed in dev environment");
    }
    config.api.fileServerHits = 0;
    await clearUsers();
    res.write("Hits reset to 0 & users table cleared");
    res.end();
}

