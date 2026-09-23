// frontend/src/lib/api/orders.ts

import { apiClient } from "@/lib/api/client";

/**
 * Payload required by order-api when creating an order.
 */
export interface CreateOrderRequest {
  customerName: string;
  product: string;
  quantity: number;
}

/**
 * Response returned by order-api after creating an order.
 */
export interface CreateOrderResponse {
  orderId: string;
}

/**
 * Represents the order data needed by the frontend.
 *
 * Keep this aligned with the actual order-api response contract.
 */
export interface Order {
  orderId: string;
  customerName: string;
  product: string;
  quantity: number;
  status: string;
}

/**
 * Creates a new order through order-api.
 */
export async function createOrder(
  input: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  return apiClient<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Retrieves an order by its ID.
 */
export async function getOrder(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}
