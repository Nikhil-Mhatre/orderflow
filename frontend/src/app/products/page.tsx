"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductGrid } from "@/components/products/product-grid";

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-3">
          <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-80 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg border">
              <div className="aspect-square animate-pulse bg-muted" />

              <div className="space-y-3 p-6">
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-xl font-semibold">Unable to load products</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading products."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>

        <p className="mt-2 text-muted-foreground">
          Browse our available products and add them to your cart.
        </p>
      </div>

      <ProductGrid products={products ?? []} />
    </main>
  );
}
