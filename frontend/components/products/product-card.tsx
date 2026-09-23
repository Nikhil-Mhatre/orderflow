// frontend/src/components/products/product-card.tsx

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Product } from "@/data/products";

interface ProductCardProps {
  /**
   * Product displayed by this card.
   */
  product: Product;
}

/**
 * Displays a single product in the OrderFlow catalog.
 *
 * The component is intentionally presentation-focused.
 * It does not communicate with order-api.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Product image */}
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <CardHeader>
        <div className="mb-2 text-sm text-muted-foreground">
          {product.category}
        </div>

        <CardTitle>{product.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{product.description}</p>

        <p className="mt-4 text-xl font-semibold">
          ${product.price.toLocaleString("en-US")}
        </p>
      </CardContent>

      <CardFooter>
        <Link
          href={`/checkout?product=${product.id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Order Now
        </Link>
      </CardFooter>
    </Card>
  );
}
