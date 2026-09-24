"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          OrderFlow
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/orders"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Orders
          </Link>
          <Link
            href="/products"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {itemCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
