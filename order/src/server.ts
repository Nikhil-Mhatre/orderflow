/**
 * HTTP server entry point.
 *
 * The application verifies PostgreSQL connectivity before
 * starting the HTTP server.
 *
 * If PostgreSQL remains unavailable after all retry attempts,
 * the application logs the failure, closes the database pool,
 * and exits without starting the HTTP server.
 */

import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { checkDatabaseConnection, db } from "./db/client.js";

/**
 * Maximum number of PostgreSQL connection attempts.
 */
const DATABASE_MAX_RETRIES = 5;

/**
 * Delay between PostgreSQL connection attempts.
 */
const DATABASE_RETRY_DELAY_MS = 3_000;

/**
 * Waits for the specified duration.
 *
 * @param milliseconds - Duration to wait in milliseconds.
 * @returns A promise that resolves after the delay.
 */
function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Checks PostgreSQL connectivity with a limited number of retries.
 *
 * @throws {Error} If all PostgreSQL connection attempts fail.
 */
async function connectToDatabaseWithRetry(): Promise<void> {
  for (let attempt = 1; attempt <= DATABASE_MAX_RETRIES; attempt += 1) {
    try {
      logger.info(
        {
          attempt,
          maxAttempts: DATABASE_MAX_RETRIES,
        },
        "Checking PostgreSQL connectivity",
      );

      await checkDatabaseConnection();

      logger.info(
        {
          host: env.database.host,
          port: env.database.port,
          database: env.database.name,
        },
        "PostgreSQL connection established",
      );

      return;
    } catch (error: unknown) {
      logger.error(
        {
          err: error,
          attempt,
          maxAttempts: DATABASE_MAX_RETRIES,
        },
        "PostgreSQL connection attempt failed",
      );

      if (attempt === DATABASE_MAX_RETRIES) {
        throw new Error(`PostgreSQL connection failed after ${DATABASE_MAX_RETRIES} attempts`, {
          cause: error,
        });
      }

      logger.info(
        {
          retryInMilliseconds: DATABASE_RETRY_DELAY_MS,
          nextAttempt: attempt + 1,
        },
        "Retrying PostgreSQL connection",
      );

      await wait(DATABASE_RETRY_DELAY_MS);
    }
  }
}

/**
 * Starts the HTTP server after PostgreSQL connectivity is verified.
 */
async function startServer(): Promise<void> {
  try {
    await connectToDatabaseWithRetry();

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

    /**
     * Prevents multiple shutdown attempts from running simultaneously.
     */
    let isShuttingDown = false;

    /**
     * Gracefully shuts down the HTTP server and PostgreSQL pool.
     *
     * @param signal - Operating-system signal that triggered shutdown.
     */
    function shutdown(signal: string): void {
      if (isShuttingDown) {
        logger.warn({ signal }, "Shutdown already in progress");

        return;
      }

      isShuttingDown = true;

      logger.info({ signal }, "Shutdown signal received");

      server.close((serverError?: Error) => {
        if (serverError) {
          logger.error({ err: serverError }, "HTTP server shutdown failed");

          process.exitCode = 1;
        } else {
          logger.info("HTTP server closed");
        }

        void db
          .end()
          .then(() => {
            logger.info("PostgreSQL connection pool closed");
          })
          .catch((databaseError: unknown) => {
            logger.error({ err: databaseError }, "PostgreSQL connection pool shutdown failed");

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
    logger.fatal(
      {
        err: error,
      },
      "Application startup failed; HTTP server will not start",
    );

    try {
      await db.end();

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
