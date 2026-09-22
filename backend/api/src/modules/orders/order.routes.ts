import { Router } from "express";

import { orderController } from "./order.controller.js";

// -----------------------------------------------------------------------------
// Order routes
// -----------------------------------------------------------------------------

/**
 * Creates the Express router for order-related endpoints.
 *
 * Route handlers delegate all request processing to OrderController.
 *
 * The router does not contain:
 * - Validation logic.
 * - Business logic.
 * - Database access.
 * - Event publishing.
 */
export function createOrderRouter(): Router {
  const router = Router();

  // ---------------------------------------------------------------------------
  // Order endpoints
  // ---------------------------------------------------------------------------

  /**
   * Create a new order.
   *
   * POST /orders
   */
  router.post("/", (req, res, next) => {
    orderController.createOrder(req, res).catch(next);
  });

  /**
   * Get all orders.
   *
   * GET /orders
   */
  router.get("/", (req, res, next) => {
    orderController.getOrders(req, res).catch(next);
  });

  /**
   * Get a single order by ID.
   *
   * GET /orders/:id
   */
  router.get("/:id", (req, res, next) => {
    orderController.getOrderById(req, res).catch(next);
  });

  return router;
}

// -----------------------------------------------------------------------------
// Shared router instance
// -----------------------------------------------------------------------------

export const orderRouter = createOrderRouter();
