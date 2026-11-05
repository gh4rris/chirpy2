import * as schema from "./schema.js"
import { config } from "../config.js";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema })
