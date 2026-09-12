import type { Request, Response } from "express";

import type { CreateOrderRequest } from "../schemas/order.schema.js";
import {
  createOrder as createOrderService,
  getOrderById as getOrderByIdService,
  getOrders as getOrdersService,
} from "../services/order.service.js";

/**
 * Handles POST /orders.
 *
 * The request body has already been validated by the Zod
 * validation middleware before this controller is executed.
 *
 * The controller is responsible only for:
 * 1. Reading the validated request data.
 * 2. Calling the order service.
 * 3. Returning the appropriate HTTP response.
 */
export async function createOrder(request: Request, response: Response): Promise<void> {
  // The validation middleware has already validated and
  // replaced request.body with the parsed Zod result.
  const input = request.body as CreateOrderRequest;

  // Delegate order creation to the service layer.
  const order = await createOrderService(input);

  // Return the newly created order with HTTP 201 Created.
  response.status(201).json({
    order,
  });
}

/**
 * Handles GET /orders.
 *
 * Retrieves all orders through the service layer and
 * returns them as a JSON response.
 */
export async function getOrders(_request: Request, response: Response): Promise<void> {
  // The service handles database access and response data preparation.
  const result = await getOrdersService();

  // Return the collection with HTTP 200 OK.
  response.status(200).json(result);
}

/**
 * Handles GET /orders/:orderId.
 *
 * Retrieves a single order using the ID supplied in the
 * route parameters.
 */
export async function getOrderById(request: Request, response: Response): Promise<void> {
  const { orderId } = request.params;

  // Express types route parameters as string | string[] | undefined.
  // This endpoint requires exactly one string parameter.
  if (typeof orderId !== "string") {
    response.status(400).json({
      error: {
        message: "A valid orderId route parameter is required",
      },
    });

    return;
  }

  // The service handles the database lookup and returns
  // a 404 AppError if the order does not exist.
  const result = await getOrderByIdService(orderId);

  response.status(200).json(result);
}
