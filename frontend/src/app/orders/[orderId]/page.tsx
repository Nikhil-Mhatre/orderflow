"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useOrderStatus } from "@/hooks/use-order-status";
import { OrderSummary } from "@/components/orders/order-summary";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const { data: order, isLoading, isError, error } = useOrderStatus(orderId);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-xl font-semibold">Unable to load order</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading the order."}
          </p>

          <Link href="/products" className={cn(buttonVariants(), "mt-6")}>
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="rounded-lg border p-6">
          <h1 className="text-xl font-semibold">Order not found</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find an order with this ID.
          </p>

          <Link href="/products" className={cn(buttonVariants(), "mt-6")}>
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>

        <p className="mt-2 text-muted-foreground">
          Track the current status of your order.
        </p>
      </div>

      <OrderSummary order={order} />

      <div className="mt-8">
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
