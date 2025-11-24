import { Suspense } from "react";
import { AllTournamentsClient } from "./_client";

export default function AllTournamentsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          All tournaments
        </h1>
        <p className="text-muted-foreground">Browse and register for events.</p>
      </header>
      <Suspense fallback={<div />}>
        <AllTournamentsClient />
      </Suspense>
    </section>
  );
}
