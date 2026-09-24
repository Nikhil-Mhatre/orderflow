import type { NextFunction, Request, Response } from "express";

import { sendData, sendPaginated } from "../../lib/http/response.js";

import { orderService } from "./order.service.js";
import {
  createOrderSchema,
  getOrderParamsSchema,
  getOrdersQuerySchema,
} from "./order.validation.js";

/**
 * POST /orders
 *
 * Creates a new order.
 */
export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(input);

    sendData(res, order, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /orders/:orderId
 *
 * Returns a single order.
 */
export async function getOrderByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderId } = getOrderParamsSchema.parse(req.params);

    const order = await orderService.getOrderById(orderId);

    sendData(res, order);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /orders
 *
 * Returns a paginated list of orders.
 */
export async function getOrdersController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = getOrdersQuerySchema.parse(req.query);

    const result = await orderService.getOrders(query);

    sendPaginated(res, result.orders, result.pagination);
  } catch (error) {
    next(error);
  }
}
