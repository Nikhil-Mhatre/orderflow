/**
 * HTTP server entry point.
 *
 * This module coordinates application startup:
 *
 * 1. Verify PostgreSQL connectivity.
 * 2. Start the HTTP server.
 * 3. Register graceful shutdown handlers.
 */

import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectToDatabase } from "./db/connection.js";
import { pool } from "./db/client.js";
import { createShutdownHandler } from "./db/shutdown.js";

/**
 * Starts the Order API.
 */
async function startServer(): Promise<void> {
  try {
    await connectToDatabase();

    const server = app.listen(env.port, () => {
      logger.info(
        {
          port: env.port,
          service: env.service.name,
          version: env.service.version,
          environment: env.nodeEnv,
        },
        "Order API server started",
      );
    });

    const shutdown = createShutdownHandler(server);

    process.once("SIGINT", () => {
      shutdown("SIGINT");
    });

    process.once("SIGTERM", () => {
      shutdown("SIGTERM");
    });
  } catch (error: unknown) {
    logger.fatal(
      {
        err: error,
      },
      "Application startup failed; HTTP server will not start",
    );

    try {
      await pool.end();

      logger.info("PostgreSQL connection pool closed");
    } catch (databaseError: unknown) {
      logger.error(
        {
          err: databaseError,
        },
        "Failed to close PostgreSQL connection pool during startup failure",
      );
    }

    process.exitCode = 1;
  }
}

/**
 * Start the application.
 */
void startServer();
