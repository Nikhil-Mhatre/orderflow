import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { products } from "../../db/schema/products.js";

import type { Product, ProductListResponse } from "./product.types.js";

export const productService = {
  /**
   * Returns all active products available for ordering.
   */
  async getAll(): Promise<ProductListResponse> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.active, true));

    return {
      products: result,
    };
  },

  /**
   * Returns an active product by its UUID.
   */
  async getById(productId: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.active, true)))
      .limit(1);

    return result[0] ?? null;
  },
};
