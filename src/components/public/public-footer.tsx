import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="font-semibold">🏓 Pickle</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize and play more pickleball.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pickle. All rights reserved.
      </div>
    </footer>
  )
}
