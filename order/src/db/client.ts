/**
 * PostgreSQL database client.
 *
 * This module creates a reusable PostgreSQL connection pool.
 * Database connectivity is verified during application startup
 * before the HTTP server begins accepting requests.
 */

import { Pool } from "pg";

import { env } from "../config/env.js";

/**
 * Shared PostgreSQL connection pool.
 *
 * The pool reuses database connections across requests.
 */
export const db = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,

  /**
   * Maximum number of connections maintained by this API instance.
   */
  max: 10,

  /**
   * Close idle connections after 30 seconds.
   */
  idleTimeoutMillis: 30_000,

  /**
   * Fail an individual connection attempt after 5 seconds.
   */
  connectionTimeoutMillis: 5_000,
});

/**
 * Verifies that PostgreSQL is reachable and accepts queries.
 *
 * @throws {Error} If PostgreSQL cannot be reached or the query fails.
 */
export async function checkDatabaseConnection(): Promise<void> {
  await db.query("SELECT 1");
}
