"use client";

import { useCart } from "@/hooks/use-cart";

import { CartEmpty } from "@/components/cart/cart-empty";
import { CartList } from "@/components/cart/cart-list";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { items } = useCart();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="mt-2 text-muted-foreground">
          Review your items before proceeding to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section>
            <CartList />
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <CartSummary />
          </aside>
        </div>
      )}
    </main>
  );
}
