/**
 * Current state of an order.
 *
 * Order lifecycle:
 *
 * PENDING
 *   ↓
 * CONFIRMED
 *   ↓
 * PROCESSING
 *   ↓
 * SHIPPED
 *   ↓
 * COMPLETED
 *
 * FAILED can occur when order processing fails.
 */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "FAILED";

/**
 * A single product included in an order.
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

/**
 * An order placed by a customer.
 */
export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data required to create a new order.
 *
 * The product name and price are not supplied by the client.
 * They are looked up from the products table when the order is created.
 */
export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  items: CreateOrderItem[];
}

/**
 * Query parameters supported by GET /orders.
 */
export interface GetOrdersQuery {
  page?: number | undefined;
  limit?: number | undefined;
}

/**
 * Pagination information returned by GET /orders.
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
