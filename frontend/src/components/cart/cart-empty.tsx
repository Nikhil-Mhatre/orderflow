import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function CartEmpty() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
      <ShoppingCart className="mb-4 h-10 w-10 text-muted-foreground" />

      <h2 className="text-lg font-semibold">Your cart is empty</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Add some products to your cart before proceeding to checkout.
      </p>

      <Link href="/products" className={cn(buttonVariants(), "mt-6")}>
        Browse products
      </Link>
    </div>
  );
}
