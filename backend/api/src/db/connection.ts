import { logger } from "../config/logger.js";

import { checkDatabaseConnection } from "./client.js";

// Number of times the application will retry the database connection
// before startup is considered unsuccessful.
const MAX_RETRIES = 5;

// Delay between database connection attempts.
const RETRY_DELAY_MS = 2_000;

/**
 * Wait for the specified amount of time.
 *
 * This keeps the retry logic easy to read without introducing another
 * dependency just for a simple delay.
 */
function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Establish connectivity with PostgreSQL before starting the HTTP server.
 *
 * The function does not create or manage the PostgreSQL pool itself.
 * That responsibility belongs to db/client.ts.
 *
 * This module only coordinates startup retry behavior.
 */
export async function connectToDatabase(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await checkDatabaseConnection();

      logger.info("Database connection established");

      return;
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES;

      logger.warn(
        {
          attempt,
          maxRetries: MAX_RETRIES,
          error,
        },
        "Database connection attempt failed",
      );

      if (isLastAttempt) {
        logger.error(
          {
            error,
            attempts: MAX_RETRIES,
          },
          "Unable to establish database connection",
        );

        throw error;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
}
