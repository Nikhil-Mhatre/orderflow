import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Order } from "@/types/orders";

import { OrderItems } from "./order-items";
import { OrderStatus } from "./order-status";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order ID</p>

          <h1 className="mt-1 break-all text-xl font-semibold">{order.id}</h1>
        </div>

        <OrderStatus status={order.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Customer</p>

          <p className="mt-1 font-medium">{order.customerName}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Created</p>

          <p className="mt-1 font-medium">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Items</h2>

        <OrderItems items={order.items} />
      </section>

      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
        <span className="font-semibold">Total</span>

        <span className="text-xl font-bold">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </div>
  );
}
