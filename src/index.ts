import { config } from "./config.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { errorMiddleware, middlewareLogResponses, middlewareMetricsLaunch } from "./api/middleware.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import { handlerCreateChirp, handlerGetChirp, handlerGetChirps } from "./api/chirps.js";
import { handlerLogin, handlerRefreshAccessToken, handlerRevokeRefreshToken } from "./api/auth.js";

import express, { type Express } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";


const migrationCient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationCient), config.db.migrationConfig);

const app: Express = express();

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsLaunch, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.post("/api/login/", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
})
app.post("/api/refresh/", (req, res, next) => {
    Promise.resolve(handlerRefreshAccessToken(req, res)).catch(next);
});
app.post("/api/revoke/", (req, res, next) => {
    Promise.resolve(handlerRevokeRefreshToken(req, res).catch(next));
})

app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerUpdateUser(req, res)).catch(next);
})

app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next)
})
app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerGetChirp(req, res)).catch(next)
})
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next)
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});

app.use(errorMiddleware);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});
