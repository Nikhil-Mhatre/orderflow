// frontend/src/app/page.tsx

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              OrderFlow Store
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simple ordering.
              <br />
              <span className="text-muted-foreground">
                Asynchronous processing.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Choose a product, place an order, and track it as OrderFlow
              processes it through its event-driven backend.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>

              <Button variant="outline" size="lg">
                <Link href="/products">Place an Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            How OrderFlow works
          </h2>

          <p className="mt-3 text-muted-foreground">
            The frontend is backed by an asynchronous order-processing
            architecture.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">01</p>

              <h3 className="mt-2 text-lg font-semibold">Select a product</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Choose one of the predefined products from the OrderFlow
                catalog.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">02</p>

              <h3 className="mt-2 text-lg font-semibold">Place an order</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Submit your customer information and create an order through the
                Order API.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">03</p>

              <h3 className="mt-2 text-lg font-semibold">Track processing</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Follow the order status while the worker processes the event
                asynchronously.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
