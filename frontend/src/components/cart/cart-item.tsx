"use client";

import Image from "next/image";

import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { ProductPrice } from "@/components/products/product-price";
import type { CartItem as CartItemType } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const { product, quantity } = item;

  const itemTotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{product.name}</h3>

          <ProductPrice
            amount={product.price}
            className="text-sm text-muted-foreground"
          />
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center rounded-md border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="min-w-10 text-center text-sm font-medium">
              {quantity}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ProductPrice
            amount={itemTotal}
            className="min-w-24 text-right font-semibold"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
