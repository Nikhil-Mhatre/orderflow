// backend/api/src/modules/orders/order.controller.ts

import type { NextFunction, Request, Response } from "express";

import {
  createOrderSchema,
  getOrderParamsSchema,
  getOrdersQuerySchema,
} from "./order.validation.js";
import {
  createOrderService,
  getOrderService,
  getOrdersService,
} from "./order.service.js";

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

// -----------------------------------------------------------------------------
// Get orders
// -----------------------------------------------------------------------------

/**
 * GET /orders
 *
 * Returns all orders
 */

export async function getOrdersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = getOrdersQuerySchema.parse(req.query);

    const result = await getOrdersService(query);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
