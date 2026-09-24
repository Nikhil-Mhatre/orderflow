export default function OrderLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-72 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-lg bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="h-48 animate-pulse rounded-lg bg-muted" />

        <div className="h-16 animate-pulse rounded-lg bg-muted" />
      </div>
    </main>
  );
}
