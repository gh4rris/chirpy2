import { config } from "../config.js";
import { type Request, type Response } from "express";


export function handlerReset(_: Request, res: Response): void {
    config.api.fileServerHits = 0;
    res.write("Hits reset to 0");
    res.end();
}

