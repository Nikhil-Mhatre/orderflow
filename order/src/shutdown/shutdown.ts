/**
 * Application shutdown lifecycle.
 *
 * This module is responsible for gracefully closing resources
 * when the application receives an operating-system termination
 * signal.
 */

import type { Server } from "node:http";

import { logger } from "../config/logger.js";
import { db } from "../db/client.js";

/**
 * Creates a graceful shutdown handler for the application.
 *
 * @param server - Running HTTP server.
 * @returns A shutdown function that accepts an operating-system signal.
 */
export function createShutdownHandler(server: Server): (signal: string) => void {
  let isShuttingDown = false;

  /**
   * Gracefully shuts down the HTTP server and PostgreSQL pool.
   *
   * @param signal - Operating-system signal that triggered shutdown.
   */
  return function shutdown(signal: string): void {
    if (isShuttingDown) {
      logger.warn({ signal }, "Shutdown already in progress");

      return;
    }

    isShuttingDown = true;

    logger.info({ signal }, "Shutdown signal received");

    server.close((serverError?: Error) => {
      if (serverError) {
        logger.error(
          {
            err: serverError,
          },
          "HTTP server shutdown failed",
        );

        process.exitCode = 1;
      } else {
        logger.info("HTTP server closed");
      }

      void closeDatabase();
    });
  };
}

/**
 * Closes the PostgreSQL connection pool.
 */
async function closeDatabase(): Promise<void> {
  try {
    await db.end();

    logger.info("PostgreSQL connection pool closed");
  } catch (error: unknown) {
    logger.error(
      {
        err: error,
      },
      "PostgreSQL connection pool shutdown failed",
    );

    process.exitCode = 1;
  }
}
