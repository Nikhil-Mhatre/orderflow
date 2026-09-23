import { createOrder, getOrderById } from "./order.data-access.js";

import type { CreateOrderInput, OrderResponse } from "./order.types.js";

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

/**
 * Creates a new order.
 *
 * The service delegates persistence and product-price resolution to the
 * data-access layer.
 *
 * The client only provides productId + quantity. Product names, prices,
 * and totalAmount are determined by the backend.
 */
export async function createOrderService(
  input: CreateOrderInput,
): Promise<OrderResponse> {
  return createOrder(input);
}

// -----------------------------------------------------------------------------
// Get order
// -----------------------------------------------------------------------------

/**
 * Retrieves an order by ID.
 */
export async function getOrderService(
  orderId: string,
): Promise<OrderResponse | null> {
  return getOrderById(orderId);
}
