// backend/api/src/modules/orders/order.route.ts

import { Router } from "express";

import {
  createOrderController,
  getOrderController,
} from "./order.controller.js";

const orderRouter = Router();

/**
 * POST /orders
 *
 * Creates an order containing one or more products.
 */
orderRouter.post("/", createOrderController);

/**
 * GET /orders/:orderId
 *
 * Retrieves an order with its items and total amount.
 */
orderRouter.get("/:orderId", getOrderController);

export { orderRouter };
