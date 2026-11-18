import { BadRequestError, NotFoundError } from "./errors.js"
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js"

import { type Request, type Response } from "express";


export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        userId: string;
        body: string;
    }

    const params: parameters = req.body;
    if (!params.userId || !params.body) {
        throw new BadRequestError("Missing required fields");
    }

    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ userId: params.userId, body: cleanedBody });
    if (!chirp) {
        throw new Error("Could not create chirp");
    }

    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId
    })
}

function validateChirp(body: string): string {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const words = body.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        } 
    }

    return words.join(" ");
}

export async function handlerGetChirps(_: Request, res: Response) {
    const chirps = await getChirps();
    if (!chirps) {
        throw new NotFoundError("No chirps found")
    }

    respondWithJSON(res, 200, chirps)
}

export async function handlerGetChirp(req: Request, res: Response) {
    const chirpId = req.params.chirpId
    if (typeof chirpId !== "string") {
        throw new BadRequestError("Invalid chirp ID")
    }

    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found")
    }

    respondWithJSON(res, 200, chirp)
}

