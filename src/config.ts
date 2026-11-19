import { MigrationConfig } from "drizzle-orm/migrator";


type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
}

type APIConfig = {
    fileServerHits: number;
    port: number;
    platform: string;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

type JWTConfig = {
    defaultDuration: number;
    issuer: string;
    secret: string;
}


process.loadEnvFile()

function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw Error(`${key} not defined`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations/"
}

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    },
    jwt: {
        defaultDuration: 3600,
        issuer: envOrThrow("TOKEN_ISSUER"),
        secret: envOrThrow("JWT_SECRET")
    }
};

