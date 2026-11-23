import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js"
import { createChirp, deleteChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js"

import { type Request, type Response } from "express";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";


export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const params: parameters = req.body;
    if (!params.body) {
        throw new BadRequestError("Missing required fields");
    }

    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ userId: userId, body: cleanedBody });
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

export async function handlerDeleteChirp(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const chirpId = req.params.chirpId;

    if (typeof chirpId !== "string") {
        throw new BadRequestError("Invalid chirp ID");
    }
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found")
    }
    if (chirp.userId !== userId) {
        throw new ForbiddenError("User not authorized");
    }

    await deleteChirp(chirpId);

    res.status(204).send();
}

