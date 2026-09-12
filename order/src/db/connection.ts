/**
 * Database connection lifecycle.
 *
 * This module is responsible for verifying PostgreSQL connectivity
 * during application startup.
 */

import { checkDatabaseConnection } from "./client.js";
import { logger } from "../config/logger.js";

/**
 * Maximum number of PostgreSQL connection attempts.
 */
const DATABASE_MAX_RETRIES = 5;

/**
 * Delay between PostgreSQL connection attempts in milliseconds.
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
 * Verifies PostgreSQL connectivity with retries.
 *
 * The application will not start accepting HTTP requests until
 * PostgreSQL connectivity has been successfully verified.
 *
 * @throws {Error} If PostgreSQL remains unavailable after all attempts.
 */
export async function connectToDatabase(): Promise<void> {
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

      logger.info("PostgreSQL connection established");

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
