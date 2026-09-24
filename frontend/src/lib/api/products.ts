import { apiClient } from "./client";
import type { Product, ProductsResponse } from "@/types/products";

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<ProductsResponse>("/products");

  return response.products;
}

export async function getProduct(productId: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${productId}`);
}
