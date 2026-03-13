"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
]

export function TopBar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/projects" className="text-sm font-medium text-foreground">
          EditTracker
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-accent text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
