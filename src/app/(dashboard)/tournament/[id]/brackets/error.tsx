"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  );
}
