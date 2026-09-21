// order-api/src/db/client.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../config/env.js";
import * as schema from "./schema/index.js";

// -----------------------------------------------------------------------------
// PostgreSQL connection pool
// -----------------------------------------------------------------------------
//
// The pool owns PostgreSQL connections for the entire Order API process.
//
// We create one pool for the service rather than opening a new PostgreSQL
// connection for every request. Drizzle uses this pool for all database
// operations.
//
// Connection limits should eventually be tuned against the actual PostgreSQL
// instance capacity and the number of Order API replicas.
export const pool = new Pool({
  connectionString: env.database.url,

  // Maximum number of PostgreSQL connections this service instance may hold.
  max: 10,

  // Close idle connections after 30 seconds.
  idleTimeoutMillis: 30_000,

  // Fail a connection attempt if PostgreSQL cannot be reached within 5 seconds.
  connectionTimeoutMillis: 5_000,
});

// -----------------------------------------------------------------------------
// Drizzle database client
// -----------------------------------------------------------------------------
//
// Drizzle is deliberately configured with the Order API's local schema.
//
// The schema is owned by this microservice rather than being placed in a
// shared @orderflow/db package. This keeps the service independently
// maintainable and prevents database implementation details from becoming
// cross-service dependencies.
export const db = drizzle(pool, {
  schema,
});

// -----------------------------------------------------------------------------
// Database health check
// -----------------------------------------------------------------------------
//
// This function is intentionally small. It verifies that the service can
// successfully communicate with PostgreSQL.
//
// Startup/retry behavior belongs in connection.ts rather than here.
// Keeping those responsibilities separate makes this module responsible only
// for database access and connection-pool ownership.
export async function checkDatabaseConnection(): Promise<void> {
  await pool.query("SELECT 1");
}
