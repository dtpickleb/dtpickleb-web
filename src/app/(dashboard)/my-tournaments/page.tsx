import { Suspense } from "react";
import { MyTournamentsClient } from "./_client";

export default function MyTournamentsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">My tournaments</h1>
        <p className="text-muted-foreground">
          Tournaments you&apos;ve organized.
        </p>
      </header>
      <Suspense fallback={<div />}>
        <MyTournamentsClient />
      </Suspense>
    </section>
  );
}
