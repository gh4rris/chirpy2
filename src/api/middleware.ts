import { config } from "../config.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./errors.js";
import { respondWithError } from "./json.js";

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

export function errorMiddleware(err: Error, _: Request, res: Response, __: NextFunction) {
    let status = 500;
    let message = "Something went wrong on our end";
    if (err instanceof BadRequestError) {
        status = 400;
        message = err.message;
    } else if (err instanceof UnauthorizedError) {
        status = 401;
        message = err.message;
    } else if (err instanceof ForbiddenError) {
        status = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        status = 404;
        message = err.message;
    } else {
        console.log(err.message);
    }
    respondWithError(res, status, message);
}
