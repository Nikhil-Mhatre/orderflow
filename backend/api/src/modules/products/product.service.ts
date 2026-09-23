import { getProductById, getProducts } from "./product.data-access.js";

import type { Product, ProductListResponse } from "./product.types.js";

export const productService = {
  /**
   * Returns all active products available for ordering.
   */
  async getAll(): Promise<ProductListResponse> {
    const products = await getProducts();

    return {
      products,
    };
  },

  /**
   * Returns an active product by its UUID.
   */
  async getById(productId: string): Promise<Product | null> {
    const product = await getProductById(productId);

    return product ?? null;
  },
};
