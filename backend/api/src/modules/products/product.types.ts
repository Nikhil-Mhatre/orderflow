// order-api/src/products/products.types.ts

// -----------------------------------------------------------------------------
// Product
// -----------------------------------------------------------------------------

/**
 * Represents a product available in the OrderFlow catalog.
 */
export interface Product {
  /**
   * Unique product identifier.
   *
   * Generated as a UUID by PostgreSQL.
   */
  id: string;

  /**
   * Product name displayed to customers.
   */
  name: string;

  /**
   * Product description.
   */
  description: string;

  /**
   * Product price in the smallest currency unit.
   *
   * Example:
   * $1,999.00 = 199900
   */
  price: number;

  /**
   * Product image URL/path.
   */
  image: string;

  /**
   * Whether the product is currently available for ordering.
   */
  active: boolean;

  /**
   * Timestamp when the product was created.
   */
  createdAt: Date;

  /**
   * Timestamp when the product was last updated.
   */
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
