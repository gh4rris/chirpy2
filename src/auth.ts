import { UserNotAuthenticatedError } from "./api/errors.js";

import { type JwtPayload } from "jsonwebtoken";
import argon2 from "argon2";
import jwt from "jsonwebtoken";


const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000)
    return jwt.sign(
        {
            iss: TOKEN_ISSUER,
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
    if (decoded.iss !== TOKEN_ISSUER || !decoded.sub) {
        throw new UserNotAuthenticatedError("Invalid token")
    }
    return decoded.sub;
}
