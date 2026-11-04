import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { errorMiddleware, middlewareLogResponses, middlewareMetricsLaunch } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/chirps.js";

import express, { type Express } from "express";


const app: Express = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsLaunch, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next)
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
