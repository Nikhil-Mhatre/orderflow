import type { ApiResponse } from "@/types/api";
import type { Product, ProductsResponse } from "@/types/products";

import { apiClient } from "./client";

export async function getProducts(): Promise<Product[]> {
  const response =
    await apiClient.get<ApiResponse<ProductsResponse>>("/products");
  console.log(response.data.products);
  return response.data.products;
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/products/${productId}`,
  );

  return response.data;
}
