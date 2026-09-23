// frontend/src/app/products/page.tsx

import { ProductCard } from "@/components/products/product-card";
import { products } from "@/data/products";

/**
 * Products page.
 *
 * Displays the predefined product catalog.
 *
 * Product data is currently owned by the frontend, so this page
 * does not make an API request.
 */
export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      {/* Page heading */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          OrderFlow Store
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Products
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Choose a product and place an order through the OrderFlow asynchronous
          order-processing system.
        </p>
      </div>

      {/* Product catalog */}
      <section
        aria-label="Product catalog"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
