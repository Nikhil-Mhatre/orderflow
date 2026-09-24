import type { OrderItem } from "@/types/orders";

import { ProductPrice } from "@/components/products/product-price";

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="divide-y rounded-lg border">
      {items.map((item) => {
        const itemTotal = item.unitPrice * item.quantity;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium">{item.productName}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.quantity} ×{" "}
                <ProductPrice
                  amount={item.unitPrice}
                  className="text-sm text-muted-foreground"
                />
              </p>
            </div>

            <ProductPrice
              amount={itemTotal}
              className="shrink-0 font-semibold"
            />
          </div>
        );
      })}
    </div>
  );
}
