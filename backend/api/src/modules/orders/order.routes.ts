// backend/api/src/modules/orders/order.route.ts

import { Router } from "express";

import {
  createOrderController,
  getOrderByIdController,
  getOrdersController,
} from "./order.controller.js";

export const orderRouter = Router();

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
orderRouter.get("/:orderId", getOrderByIdController);

/**
 * GET /orders
 *
 * Retrieves all orders together with their order items.
 */
orderRouter.get("/", getOrdersController);
