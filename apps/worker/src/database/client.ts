import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../config/env.js";
import * as schema from "@orderflow/contracts";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const db = drizzle(pool, {
  schema,
});

export async function checkDatabaseConnection(): Promise<void> {
  await pool.query("SELECT 1");
}

export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}
