import { MigrationConfig } from "drizzle-orm/migrator";


type Config = {
    api: APIConfig;
    db: DBConfig;
}

type APIConfig = {
    fileServerHits: number;
    port: number;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
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
        port: Number(envOrThrow("DB_URL"))
    },
    db: {
        url: envOrThrow("PORT"),
        migrationConfig: migrationConfig
    }
};

