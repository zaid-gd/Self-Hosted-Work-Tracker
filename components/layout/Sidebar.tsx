"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-48 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="px-5 py-4">
        <Link href="/projects" className="text-sm font-medium text-sidebar-foreground">
          EditTracker
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/68 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
