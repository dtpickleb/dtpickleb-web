import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto grid max-w-screen-2xl items-center gap-6 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Run pickleball tournaments <span className="text-primary">without the chaos</span>.
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Create events, accept registrations, build brackets and publish results—fast.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild size="lg"><Link href="/sign-up">Create free account</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/about">Learn more</Link></Button>
            </div>
          </div>
          <div className="rounded-2xl border p-6">
            {/* placeholder illustration/card you can replace with product shots */}
            <div className="aspect-[16/10] rounded-xl bg-muted" />
            <p className="mt-3 text-sm text-muted-foreground">Bracket & schedule previews</p>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features">
        <div className="mx-auto max-w-screen-2xl px-4 py-16 md:py-20">
          <h2 className="text-2xl font-semibold">Everything you need</h2>
          <p className="mt-2 text-muted-foreground">Start simple. Grow into advanced scheduling and leaderboards.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Create tournaments", "Set divisions, fees, venues in minutes."],
              ["Easy registrations", "Collect player info and payments."],
              ["Brackets & results", "Single/double elim, publish results."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border p-5">
                <div className="text-base font-medium">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-4 py-14 text-center">
          <h3 className="text-2xl font-semibold">Ready to host your first tournament?</h3>
          <p className="mt-2 text-muted-foreground">It’s free to start—upgrade when you grow.</p>
          <div className="mt-6">
            <Button asChild size="lg"><Link href="/sign-up">Get started</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
