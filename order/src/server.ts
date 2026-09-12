/**
 * HTTP server entry point.
 *
 * The application verifies database connectivity before starting
 * the HTTP server. If the database remains unavailable after the
 * configured retries, the process exits gracefully.
 */

import app from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection, db } from "./db/client.js";
import { logError, logInfo } from "./config/logger.js";

/**
 * Maximum number of database connection attempts.
 */
const DATABASE_MAX_RETRIES = 5;

/**
 * Delay between database connection attempts in milliseconds.
 */
const DATABASE_RETRY_DELAY_MS = 3_000;

/**
 * Pauses execution for the specified number of milliseconds.
 *
 * @param milliseconds - Delay duration.
 * @returns A promise that resolves after the delay.
 */
function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Verifies database connectivity with retries.
 *
 * @throws {Error} If all connection attempts fail.
 */
async function connectToDatabaseWithRetry(): Promise<void> {
  for (let attempt = 1; attempt <= DATABASE_MAX_RETRIES; attempt += 1) {
    try {
      logInfo("Checking PostgreSQL connectivity.", {
        attempt,
        maxAttempts: DATABASE_MAX_RETRIES,
      });

      await checkDatabaseConnection();

      logInfo("PostgreSQL connection established.");

      return;
    } catch (error: unknown) {
      logError("PostgreSQL connection attempt failed.", error);

      if (attempt === DATABASE_MAX_RETRIES) {
        throw new Error(`PostgreSQL connection failed after ${DATABASE_MAX_RETRIES} attempts.`, {
          cause: error,
        });
      }

      logInfo("Retrying PostgreSQL connection.", {
        retryInMilliseconds: DATABASE_RETRY_DELAY_MS,
      });

      await wait(DATABASE_RETRY_DELAY_MS);
    }
  }
}

/**
 * Starts the HTTP server only after PostgreSQL is available.
 */
async function startServer(): Promise<void> {
  try {
    await connectToDatabaseWithRetry();

    const server = app.listen(env.port, () => {
      logInfo("Order API server started.", {
        service: env.service.name,
        version: env.service.version,
        environment: env.nodeEnv,
        port: env.port,
      });
    });

    /**
     * Gracefully shut down the HTTP server and database pool.
     */
    function shutdown(signal: string): void {
      logInfo("Shutdown signal received.", {
        signal,
      });

      server.close((serverError?: Error) => {
        if (serverError) {
          logError("HTTP server shutdown failed.", serverError);
          process.exitCode = 1;
        } else {
          logInfo("HTTP server closed.");
        }

        void db
          .end()
          .then(() => {
            logInfo("PostgreSQL connection pool closed.");
          })
          .catch((databaseError: unknown) => {
            logError("PostgreSQL connection pool shutdown failed.", databaseError);

            process.exitCode = 1;
          });
      });
    }

    process.once("SIGINT", () => {
      shutdown("SIGINT");
    });

    process.once("SIGTERM", () => {
      shutdown("SIGTERM");
    });
  } catch (error: unknown) {
    logError("Application startup failed. The HTTP server will not start.", error);

    await db.end();

    process.exitCode = 1;
  }
}

void startServer();
