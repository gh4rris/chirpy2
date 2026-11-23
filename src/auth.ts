import { BadRequestError, UserNotAuthenticatedError } from "./api/errors.js";
import { config } from "./config.js";

import { type JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000)
    return jwt.sign(
        {
            iss: config.jwt.issuer,
            sub: userID,
            iat: iat,
            exp: iat + expiresIn
        } satisfies payload,
        secret,
        { algorithm: "HS256" }
    );
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new UserNotAuthenticatedError("Invalid token")
    }
    if (decoded.iss !== config.jwt.issuer || !decoded.sub) {
        throw new UserNotAuthenticatedError("Invalid token")
    }
    return decoded.sub;
}

export function extractBearerToken(authorization: string | undefined): string {
    const words = authorization?.split(" ");
    if (!words || words[0] != "Bearer") {
        throw new UserNotAuthenticatedError("Invalid token")
    }
    return words[1];
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    return extractBearerToken(authHeader);
}

export function makeRefreshToken(): string {
    const token = crypto.randomBytes(32);
    return token.toString("hex");
}
