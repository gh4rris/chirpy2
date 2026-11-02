import { config } from "../config.js";
import { type Request, type Response } from "express";


export function handlerMetrics(_: Request, res: Response): void {
    res.set("Content-Type", "text/html; charset=utf-8")
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

export function handlerReset(_: Request, res: Response): void {
    config.fileserverHits = 0;
    res.write("Hits reset to 0");
    res.end();
}
