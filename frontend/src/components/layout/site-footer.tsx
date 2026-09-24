export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OrderFlow</p>

        <p>Order processing platform</p>
      </div>
    </footer>
  );
}
