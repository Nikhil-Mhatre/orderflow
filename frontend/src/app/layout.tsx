import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/providers/cart-provider";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "OrderFlow",
  description: "Order processing platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />

              <main className="flex-1">{children}</main>

              <SiteFooter />
            </div>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
