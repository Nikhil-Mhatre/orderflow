import { logger } from "../config/logger.js";

import { pool } from "./client.db.js";
import type { OrderWorker } from "../worker/order-worker.js";

/**
 * Application shutdown lifecycle for the Order Worker.
 *
 * Shutdown order:
 *
 * 1. Stop polling SQS.
 * 2. Allow the worker to finish its current work.
 * 3. Close the PostgreSQL connection pool.
 */
export function createShutdownHandler(
  worker: OrderWorker,
): (signal: string) => void {
  let isShuttingDown = false;

  return function shutdown(signal: string): void {
    if (isShuttingDown) {
      logger.warn({ signal }, "Shutdown already in progress");

      return;
    }

    isShuttingDown = true;

    logger.info({ signal }, "Shutdown signal received");

    void shutdownApplication(worker);
  };
}

/**
 * Gracefully shuts down the worker and PostgreSQL.
 */
async function shutdownApplication(worker: OrderWorker): Promise<void> {
  try {
    await worker.stop();

    logger.info("Order Worker stopped");
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Order Worker shutdown failed",
    );

    process.exitCode = 1;
  }

  try {
    await pool.end();

    logger.info("PostgreSQL connection pool closed");
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "PostgreSQL connection pool shutdown failed",
    );

    process.exitCode = 1;
  }
}
