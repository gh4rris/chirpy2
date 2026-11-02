import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsLaunch } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/chirps.js";

import express, { type Express } from "express";


const app: Express = express();
const PORT = 8080;

app.use("/app", middlewareMetricsLaunch, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
