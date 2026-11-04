import { BadRequestError } from "./errors.js"
import { respondWithJSON } from "./json.js"

import { type Request, type Response } from "express";


export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
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

