import type { OrderStatus } from "./order.constants.js";

// -----------------------------------------------------------------------------
// Order item
// -----------------------------------------------------------------------------

/**
 * Represents a product included in an order.
 *
 * Product information is resolved from the products table when
 * the order is created.
 */
export interface OrderItem {
  /**
   * Unique identifier of the order item.
   */
  id: string;

  /**
   * UUID of the product from the products table.
   */
  productId: string;

  /**
   * Snapshot of the product name at the time the order was created.
   */
  productName: string;

  /**
   * Number of units ordered.
   */
  quantity: number;

  /**
   * Snapshot of the product price at the time the order was created.
   *
   * Stored in the smallest currency unit.
   *
   * Example:
   * $1,999.00 = 199900
   */
  unitPrice: number;
}

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

/**
 * Input required to create an order.
 *
 * The client provides product IDs and quantities.
 * The backend resolves product names and prices.
 */
export interface CreateOrderInput {
  /**
   * Customer placing the order.
   */
  customerName: string;

  /**
   * Products being purchased.
   */
  items: CreateOrderItemInput[];
}

/**
 * Input representing one product being added to an order.
 */
export interface CreateOrderItemInput {
  /**
   * UUID of the product being ordered.
   */
  productId: string;

  /**
   * Number of units requested.
   */
  quantity: number;
}

// -----------------------------------------------------------------------------
// Order response
// -----------------------------------------------------------------------------

/**
 * Complete representation of an order returned by the API.
 */
export interface OrderResponse {
  /**
   * Unique order identifier.
   */
  id: string;

  /**
   * Customer associated with the order.
   */
  customerName: string;

  /**
   * Items included in the order.
   */
  items: OrderItem[];

  /**
   * Authoritative total amount for the order.
   *
   * Stored in the smallest currency unit.
   */
  totalAmount: number;

  /**
   * Current processing status.
   */
  status: OrderStatus;

  /**
   * Timestamp when the order was created.
   */
  createdAt: Date;

  /**
   * Timestamp when the order was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Order list
// -----------------------------------------------------------------------------

/**
 * Response returned when retrieving multiple orders.
 */
export interface OrderListResponse {
  orders: OrderResponse[];
}
