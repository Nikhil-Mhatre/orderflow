import type { Request, Response } from "express";

import { orderService } from "./order.service.js";
import { createOrderSchema, orderIdParamsSchema } from "./order.validation.js";

// -----------------------------------------------------------------------------
// Order controller
// -----------------------------------------------------------------------------

/**
 * Handles HTTP requests for the Order API.
 *
 * Responsibilities:
 * - Read HTTP request data.
 * - Validate request input.
 * - Call the appropriate application service.
 * - Translate service results into HTTP responses.
 *
 * The controller does not:
 * - Execute database queries.
 * - Publish events.
 * - Contain order business logic.
 * - Know about EventBridge or SQS.
 */
export class OrderController {
  // ---------------------------------------------------------------------------
  // Create order
  // ---------------------------------------------------------------------------

  /**
   * Handles:
   *
   * POST /orders
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    const input = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(input);

    res.status(201).json(order);
  }

  // ---------------------------------------------------------------------------
  // Get order
  // ---------------------------------------------------------------------------

  /**
   * Handles:
   *
   * GET /orders/:id
   */
  async getOrderById(req: Request, res: Response): Promise<void> {
    const { id } = orderIdParamsSchema.parse(req.params);

    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({
        error: "ORDER_NOT_FOUND",
        message: "Order not found",
      });

      return;
    }

    res.status(200).json(order);
  }

  // ---------------------------------------------------------------------------
  // List orders
  // ---------------------------------------------------------------------------

  /**
   * Handles:
   *
   * GET /orders
   */
  async getOrders(_req: Request, res: Response): Promise<void> {
    const orders = await orderService.getOrders();

    res.status(200).json({
      orders,
    });
  }
}

// -----------------------------------------------------------------------------
// Shared controller instance
// -----------------------------------------------------------------------------

/**
 * Shared OrderController instance used by the Order API routes.
 */
export const orderController = new OrderController();
