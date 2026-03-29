export function Spinner() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
    </div>
  );
}
