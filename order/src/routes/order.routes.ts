import { Router } from "express";

import { createOrder, getOrderById, getOrders } from "../controllers/order.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createOrderSchema } from "../schemas/order.schema.js";

const router = Router();

/**
 * Create a new order.
 *
 * Zod validates the request body before the controller runs.
 */
router.post("/orders", validateBody(createOrderSchema), createOrder);

/**
 * Retrieve all orders.
 */
router.get("/orders", getOrders);

/**
 * Retrieve a single order by UUID.
 */
router.get("/orders/:orderId", getOrderById);

export default router;
