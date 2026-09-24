"use client";

import { useCart } from "@/hooks/use-cart";

import { CartItem } from "./cart-item";

export function CartList() {
  const { items } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}
    </div>
  );
}
