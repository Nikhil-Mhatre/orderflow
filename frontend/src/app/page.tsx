import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-16">
          <div className="max-w-3xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Simple ordering.
              <br />
              Reliable processing.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Browse products, build your cart, and place an order. OrderFlow
              handles the order processing workflow after checkout.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Browse products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/cart"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Browse products</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              View the products currently available through the catalog.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Build your cart</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add multiple products and adjust quantities before checkout.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Track your order</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              After checkout, follow the order status as it moves through the
              processing workflow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
