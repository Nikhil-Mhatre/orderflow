"use client";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CheckoutSummary() {
  const { items, itemCount, totalAmount } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.product.name}</p>

                <p className="text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.product.price)}
                </p>
              </div>

              <span className="shrink-0 font-medium">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-muted-foreground">Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
