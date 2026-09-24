"use client";

import { useCart } from "@/hooks/use-cart";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CartEmpty } from "@/components/cart/cart-empty";

export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>

        <CartEmpty />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

        <p className="mt-2 text-muted-foreground">
          Enter your details and review your order before placing it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <section>
          <CheckoutForm />
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <CheckoutSummary />
        </aside>
      </div>
    </main>
  );
}
