import { UserNotAuthenticatedError, BadRequestError } from "./api/errors.js";
import { makeJWT, validateJWT } from "./auth.js";
import { hashPassword, checkPasswordHash, extractBearerToken } from "./auth.js";

import { describe, it, expect, beforeAll } from "vitest";


describe("Password Hashing", () => {
    const password1 = "correctpassword123!";
    const password2 = "anotherpassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
        const result = await checkPasswordHash("wrongpassword", hash1);
        expect(result).toBe(false);
    })

    it("should return false for missing password", async () => {
        const result = await checkPasswordHash("", hash1);
        expect(result).toBe(false);
    })
});

describe("JWT Functions", () => {
    const userId = "123";
    const secret = "mysecret";

    let tokenString: string;

    beforeAll(() => {
        tokenString = makeJWT(userId, 200, secret);
    });

    it("should validate token", () => {
        const result = validateJWT(tokenString, secret);
        expect(result).toBe(userId)
    })

    it("should throw error for invalid token", () => {
        expect(() => validateJWT("invalidtoken", secret)).toThrow(UserNotAuthenticatedError);
    })

    it("should throw error for wrong secret", () => {
        expect(() => validateJWT(tokenString, "wrongsecret")).toThrow(UserNotAuthenticatedError);
    })
});

describe("Extract Bearer Token", () => {
    const authorization = "Bearer 123";

    it("should extract valid token", () => {
        const result = extractBearerToken(authorization);
        expect(result).toBe("123");
    });

    it("should throw error for invalid token format", () => {
        expect(() => extractBearerToken("Bearer123")).toThrow(BadRequestError);
    });

    it("should throw error for undefined authorization", () => {
        expect(() => extractBearerToken(undefined)).toThrow(BadRequestError);
    });
})
