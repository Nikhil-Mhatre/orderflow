// frontend/src/app/checkout/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutPageProps {
  searchParams: Promise<{
    product?: string;
  }>;
}

/**
 * Checkout page.
 *
 * The selected product is identified through the `product` query
 * parameter:
 *
 * /checkout?product=macbook-pro
 *
 * The product itself remains owned by the frontend catalog.
 */
export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const productId = params.product;

  // A checkout page without a product is not meaningful.
  if (!productId) {
    notFound();
  }

  // Resolve the product from the frontend catalog.
  const product = products.find((item) => item.id === productId);

  // Prevent checkout with an unknown product ID.
  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Back navigation */}
        <Link
          href="/products"
          className="mb-6 inline-flex items-center rounded-md px-0 py-2 text-sm font-medium hover:underline"
        >
          ← Back to Products
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            OrderFlow Store
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

          <p className="mt-2 text-muted-foreground">
            Review your product and provide your customer information.
          </p>
        </div>

        {/* Selected product */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{product.name}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <p className="shrink-0 font-semibold">
                ${product.price.toLocaleString("en-US")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checkout form will be added next */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer information form will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
