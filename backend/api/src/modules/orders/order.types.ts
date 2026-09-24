import type { OrderStatus } from "./order.constants.js";

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  items: CreateOrderItemInput[];
}

// -----------------------------------------------------------------------------
// Get orders
// -----------------------------------------------------------------------------

export interface GetOrdersQuery {
  page?: number | undefined;
  limit?: number | undefined;
}

// -----------------------------------------------------------------------------
// Order item
// -----------------------------------------------------------------------------

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// -----------------------------------------------------------------------------
// Order response
// -----------------------------------------------------------------------------

export interface OrderResponse {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Order list response
// -----------------------------------------------------------------------------

export interface OrderListResponse {
  orders: OrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
