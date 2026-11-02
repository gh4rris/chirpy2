import { respondWithJSON, respondWithError } from "./json.js"

import { type Request, type Response } from "express";


export function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    let params: parameters;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        } catch (e) {
            respondWithError(res, 400, "Invalid JSON");
            return;
        }
        if (params.body.length > 140) {
            respondWithError(res, 400, "Chirp is too long");
            res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
            return;
        }
        respondWithJSON(res, 200, { valid: true })
    })
}

