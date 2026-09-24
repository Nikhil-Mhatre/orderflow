import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Order } from "@/types/orders";

import { OrderStatus } from "./order-status";
import { ProductPrice } from "@/components/products/product-price";

interface OrderListItemProps {
  order: Order;
}

export function OrderListItem({ order }: OrderListItemProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-lg border p-5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {order.customerName}
          </p>
        </div>

        <OrderStatus status={order.status} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">
            <ProductPrice amount={order.totalAmount} />
          </span>

          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
