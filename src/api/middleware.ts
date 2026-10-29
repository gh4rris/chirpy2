import { config } from "../config.js";

import { type NextFunction, type Request, type Response } from "express";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    next();
}

export function middlewareMetricsLaunch(_: Request, __: Response, next: NextFunction): void {
    config.fileserverHits += 1;
    next();
}
