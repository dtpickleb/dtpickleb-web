import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { isAuthedServer } from "@/lib/auth-server"

const nav = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export async function PublicNavbar() {
  const isAuthed = await isAuthedServer()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold">🏓 Pickle</Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
              <Button asChild>
                <Link href="/sign-up">Create account</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <PublicNavbarMobile isAuthed={isAuthed} />
      </div>
    </header>
  )
}

function PublicNavbarMobile({ isAuthed }: { isAuthed: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-4 p-6">
        <nav className="flex flex-col gap-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          {isAuthed ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline"><Link href="/sign-in">Sign in</Link></Button>
              <Button asChild><Link href="/sign-up">Create account</Link></Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
