// backend/api/src/modules/orders/order.controller.ts

import type { Request, Response } from "express";

import { createOrderSchema, getOrderParamsSchema } from "./order.validation.js";
import { createOrderService, getOrderService } from "./order.service.js";

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

/**
 * POST /orders
 *
 * Creates a new order containing one or more products.
 */
export async function createOrderController(
  req: Request,
  res: Response,
): Promise<void> {
  const input = createOrderSchema.parse(req.body);

  const order = await createOrderService(input);

  res.status(201).json(order);
}

// -----------------------------------------------------------------------------
// Get order
// -----------------------------------------------------------------------------

/**
 * GET /orders/:orderId
 *
 * Returns a single order with its items and total amount.
 */
export async function getOrderController(
  req: Request,
  res: Response,
): Promise<void> {
  const { orderId } = getOrderParamsSchema.parse(req.params);

  const order = await getOrderService(orderId);

  if (!order) {
    res.status(404).json({
      message: "Order not found",
    });

    return;
  }

  res.status(200).json(order);
}
