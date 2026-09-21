import express from "express";
import { pinoHttp } from "pino-http";

import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { orderRouter } from "./modules/orders/order.routes.js";

/**
 * Creates and configures the Express application.
 *
 * This function is responsible only for composing the HTTP application.
 *
 * It does not:
 * - open database connections;
 * - start the HTTP server;
 * - manage process shutdown;
 * - contain business logic.
 *
 * Those responsibilities belong to the appropriate infrastructure and
 * lifecycle modules.
 */
function createApp(): express.Express {
  const app = express();

  // ---------------------------------------------------------------------------
  // 1. Request logging
  // ---------------------------------------------------------------------------

  /**
   * Adds structured HTTP request logging through pino-http.
   *
   * pino-http also exposes request-scoped logging through request.log.
   */
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );

  // ---------------------------------------------------------------------------
  // 2. Request body parsing
  // ---------------------------------------------------------------------------

  /**
   * Parses JSON request bodies and exposes the result through req.body.
   *
   * The limit prevents unnecessarily large JSON payloads from reaching
   * application code.
   */
  app.use(
    express.json({
      limit: "1mb",
    }),
  );

  // ---------------------------------------------------------------------------
  // 3. Health endpoints
  // ---------------------------------------------------------------------------

  /**
   * Health endpoints are registered before application routes.
   *
   * The health module is responsible for determining the appropriate health
   * and readiness semantics.
   */
  app.use(healthRouter);

  // ---------------------------------------------------------------------------
  // 4. Application routes
  // ---------------------------------------------------------------------------

  /**
   * Order endpoints:
   *
   * POST   /orders
   * GET    /orders
   * GET    /orders/:id
   *
   * The order router is responsible only for mapping HTTP routes to the
   * corresponding controller methods.
   */
  app.use("/orders", orderRouter);

  // ---------------------------------------------------------------------------
  // 5. Not-found middleware
  // ---------------------------------------------------------------------------

  /**
   * This middleware is reached only when no registered route matched the
   * incoming request.
   *
   * It must remain after all application routes.
   */
  app.use(notFoundMiddleware);

  // ---------------------------------------------------------------------------
  // 6. Centralized error middleware
  // ---------------------------------------------------------------------------

  /**
   * This must remain the final middleware in the Express pipeline.
   *
   * Errors propagated from controllers, services, repositories, validation,
   * and other middleware are handled here.
   */
  app.use(errorMiddleware);

  return app;
}

// -----------------------------------------------------------------------------
// Application instance
// -----------------------------------------------------------------------------

/**
 * Fully configured Express application.
 *
 * server.ts is responsible for starting the HTTP server.
 */
const app = createApp();

export default app;
