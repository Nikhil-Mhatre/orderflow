/**
 * Represents the possible states of an order throughout its lifecycle.
 *
 * PENDING: The order has been created and is waiting for processing.
 *
 * PROCESSING: The order worker is currently processing the order.
 *
 * COMPLETED: The order has been successfully processed.
 *
 * FAILED: The order could not be processed successfully.
 */
export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

/**
 * Represents the data required to create a new order.
 *
 * This type is used for the POST /orders request body.
 *
 * The API will validate these values before creating an order.
 */
export interface CreateOrderInput {
  /** Name of the customer placing the order. */
  customerName: string;

  /** Name or description of the product being ordered. */
  product: string;

  /** Number of units ordered. */
  quantity: number;
}

/**
 * Represents an order stored in the database.
 *
 * The database generates the ID and manages the timestamps.
 * The status is initially set to PENDING.
 */
export interface Order {
  /** Unique identifier of the order. */
  id: string;

  /** Name of the customer who placed the order. */
  customerName: string;

  /** Name or description of the ordered product. */
  product: string;

  /** Number of units in the order. */
  quantity: number;

  /** Current processing status of the order. */
  status: OrderStatus;

  /** Timestamp when the order was created. */
  createdAt: Date;

  /** Timestamp when the order was last updated. */
  updatedAt: Date;
}

/**
 * Represents the response returned after creating an order.
 *
 * The API should return the newly created order to the client.
 */
export interface CreateOrderResponse {
  /** The newly created order. */
  order: Order;
}

/**
 * Represents the response returned when retrieving multiple orders.
 */
export interface GetOrdersResponse {
  /** List of orders. */
  orders: Order[];

  /** Total number of orders returned. */
  total: number;
}

/**
 * Represents the response returned when retrieving a single order.
 */
export interface GetOrderResponse {
  /** The requested order. */
  order: Order;
}
