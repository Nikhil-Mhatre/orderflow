import { apiClient } from "./client";
import type {
  CreateOrderRequest,
  Order,
  OrderListResponse,
} from "@/types/orders";

interface ApiResponse<T> {
  data: T;
}

export function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>("/orders", data);
}

export function getOrder(orderId: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/${orderId}`);
}

export async function getOrders(): Promise<OrderListResponse> {
  const response =
    await apiClient.get<ApiResponse<OrderListResponse>>("/orders");

  return response.data;
}
