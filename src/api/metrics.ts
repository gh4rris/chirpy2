import { config } from "../config.js";
import { type Request, type Response } from "express";


export function handlerMetrics(_: Request, res: Response): void {
    res.send(`Hits: ${config.fileserverHits}`);
}

export function handlerReset(_: Request, res: Response): void {
    config.fileserverHits = 0;
    res.write("Hits reset to 0");
    res.end;
}
