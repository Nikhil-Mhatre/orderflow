// order-api/src/products/products.types.ts

// -----------------------------------------------------------------------------
// Product
// -----------------------------------------------------------------------------

/**
 * Represents a product available in the OrderFlow catalog.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Product list
// -----------------------------------------------------------------------------

/**
 * Response returned when retrieving the product catalog.
 */
export interface ProductListResponse {
  products: Product[];
}
