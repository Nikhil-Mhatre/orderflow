import type { Request, Response } from "express";

import { checkDatabaseConnection } from "../../db/client.js";
import { logger } from "../../config/logger.js";

/**
 * Liveness endpoint.
 *
 * This endpoint answers a simple question:
 * "Is the Order API process alive and able to handle requests?"
 *
 * It intentionally does not check PostgreSQL, EventBridge, or any other
 * external dependency. A temporary dependency failure should not cause
 * Kubernetes to restart a healthy application process.
 */
export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
  });
}

/**
 * Readiness endpoint.
 *
 * This endpoint answers:
 * "Is the Order API ready to receive normal traffic?"
 *
 * PostgreSQL is currently the API's critical startup dependency, so the
 * readiness check verifies database connectivity.
 */
export async function getReadiness(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    await checkDatabaseConnection();

    res.status(200).json({
      status: "ok",
      dependencies: {
        database: "ok",
      },
    });
  } catch (error) {
    logger.warn(
      {
        error,
      },
      "Order API is not ready because the database is unavailable",
    );

    res.status(503).json({
      status: "not_ready",
      dependencies: {
        database: "unavailable",
      },
    });
  }
}
