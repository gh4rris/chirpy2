import { respondWithJSON, respondWithError } from "./json.js"

import { type Request, type Response } from "express";


export function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    if (params.body.length > 140) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const words = params.body.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        } 
    }

    const cleanedBody  = words.join(" ");
    respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}

