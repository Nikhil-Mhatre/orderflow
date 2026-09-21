// apps/order-api/src/orders/order.types.ts

import type { OrderStatus } from "./order.constants.js";

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

/**
 * Input required to create an order.
 *
 * This represents the application-level input after request validation.
 *
 * HTTP-specific concerns such as Express Request/Response objects do not
 * belong in this type.
 */
export interface CreateOrderInput {
  customerName: string;
  product: string;
  quantity: number;
}

// -----------------------------------------------------------------------------
// Order response
// -----------------------------------------------------------------------------

/**
 * Representation of an order returned by the Order API.
 *
 * This type intentionally uses API-friendly property names and does not expose
 * database implementation details.
 */
export interface OrderResponse {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Order list
// -----------------------------------------------------------------------------

/**
 * Collection returned when retrieving orders.
 *
 * Pagination metadata can be added here later when pagination becomes part
 * of the API contract.
 */
export interface OrderListResponse {
  orders: OrderResponse[];
}
