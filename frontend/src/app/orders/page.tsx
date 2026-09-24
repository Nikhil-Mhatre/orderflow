"use client";

import Link from "next/link";

import { useOrders } from "@/hooks/use-orders";

import { OrderList } from "@/components/orders/order-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

export default function OrdersPage() {
  const { data, isLoading, isError, error, isFetching } = useOrders();
  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-8 space-y-3">
          <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-80 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-lg border bg-muted/50"
            />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-xl font-semibold">Unable to load orders</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading orders."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

          <p className="mt-2 text-muted-foreground">
            View your orders and track their current status.
          </p>
        </div>

        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Shop products
        </Link>
      </div>

      <div className="mb-4 flex min-h-6 items-center justify-end">
        {isFetching && (
          <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing orders</span>
          </div>
        )}
      </div>

      <OrderList orders={orders} />
    </main>
  );
}
