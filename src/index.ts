import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsLaunch } from "./api/middleware.js";

import express, { type Express } from "express";


const app: Express = express();
const PORT = 8080;

app.use("/app", middlewareMetricsLaunch, express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
