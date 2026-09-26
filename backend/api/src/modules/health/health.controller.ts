import type { Request, Response } from "express";

import { checkDatabaseConnection } from "../../db/client.js";
import { logger } from "../../config/logger.js";
import { sendData } from "../../lib/http/response.js";

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
  sendData(res, { status: "ok" }, 200);
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

    sendData(
      res,
      {
        status: "ok",
        dependencies: {
          database: "ok",
        },
      },
      200,
    );
  } catch (error) {
    logger.warn(
      {
        error,
      },
      "Order API is not ready because the database is unavailable",
    );

    sendData(
      res,
      {
        status: "not_ready",
        dependencies: {
          database: "unavailable",
        },
      },
      503,
    );
  }
}
