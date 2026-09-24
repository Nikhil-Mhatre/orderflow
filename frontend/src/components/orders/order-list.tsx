import type { Order } from "@/types/orders";

import { OrderListItem } from "./order-list-item";

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="font-semibold">No orders yet</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Orders you place will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderListItem key={order.id} order={order} />
      ))}
    </div>
  );
}
