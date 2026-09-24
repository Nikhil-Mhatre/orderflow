"use client";

import Image from "next/image";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>

        <p className="mt-4 text-lg font-semibold">
          {formatCurrency(product.price)}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="w-full"
          onClick={() => addItem(product)}
          disabled={!product.active}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />

          {product.active ? "Add to cart" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
