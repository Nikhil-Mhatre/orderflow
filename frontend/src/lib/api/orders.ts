import type { ApiResponse, PaginatedResponse } from "@/types/api";

import type { CreateOrderRequest, Order } from "@/types/orders";

import { apiClient } from "./client";

export async function createOrder(input: CreateOrderRequest): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>("/orders", input);

  return response.data;
}

export async function getOrders(): Promise<PaginatedResponse<Order>> {
  const response = await apiClient.get<PaginatedResponse<Order>>("/orders");

  return response;
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await apiClient.get<ApiResponse<Order>>(
    `/orders/${orderId}`,
  );

  return response.data;
}
