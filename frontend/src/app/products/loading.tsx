export default function ProductsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-80 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border">
            <div className="aspect-square animate-pulse bg-muted" />

            <div className="space-y-3 p-6">
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
