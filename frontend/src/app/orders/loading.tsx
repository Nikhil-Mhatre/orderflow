export default function OrdersLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-80 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-5">
            <div className="flex justify-between gap-4">
              <div className="space-y-3">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="mt-6 flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
