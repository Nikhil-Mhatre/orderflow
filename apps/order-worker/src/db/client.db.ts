import { Pool } from "pg";

import { env } from "../config/env.js";

// -----------------------------------------------------------------------------
// PostgreSQL connection pool
// -----------------------------------------------------------------------------
//
// The pool owns PostgreSQL connections for the entire Order Worker process.
//
// We create one pool for the worker rather than opening a new PostgreSQL
// connection for every order-processing operation.
//
// The repository layer uses this pool for database operations.
export const pool = new Pool({
  connectionString: env.database.url,

  // Maximum number of PostgreSQL connections this worker instance may hold.
  max: 10,

  // Close idle connections after 30 seconds.
  idleTimeoutMillis: 30_000,

  // Fail a connection attempt if PostgreSQL cannot be reached within 5 seconds.
  connectionTimeoutMillis: 5_000,
});

// -----------------------------------------------------------------------------
// Database health check
// -----------------------------------------------------------------------------
//
// This function verifies that the worker can communicate with PostgreSQL.
//
// Startup retry behavior belongs in connection.ts.
// Shutdown behavior belongs in shutdown.ts.
export async function checkDatabaseConnection(): Promise<void> {
  await pool.query("SELECT 1");
}
