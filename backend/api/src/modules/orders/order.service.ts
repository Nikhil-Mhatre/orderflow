import { createOrder, getOrderById, getOrders } from "./order.data-access.js";

import type {
  CreateOrderInput,
  GetOrdersQuery,
  OrderResponse,
} from "./order.types.js";

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

// -----------------------------------------------------------------------------
// Get orders
// -----------------------------------------------------------------------------

/**
 * Retrieves all orders together with their order items.
 */
export async function getOrdersService(query: GetOrdersQuery) {
  return getOrders(query);
}
