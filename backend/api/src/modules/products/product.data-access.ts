import { and, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { products } from "../../db/schema/products.js";

// -----------------------------------------------------------------------------
// Get all active products
// -----------------------------------------------------------------------------

export async function getProducts() {
  return db.select().from(products).where(eq(products.active, true));
}

// -----------------------------------------------------------------------------
// Get active product by ID
// -----------------------------------------------------------------------------

export async function getProductById(productId: string) {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.active, true)))
    .limit(1);

  return result[0];
}
