"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
]

type SidebarProps = {
  showUserButton?: boolean
}

export function Sidebar({ showUserButton = true }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-52 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="border-b border-sidebar-border px-4 py-4">
        <Link href="/projects" className="text-sm font-medium tracking-[-0.01em] text-sidebar-foreground">
          EditTracker
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3">
        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3">
        {showUserButton ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-7 w-7",
              },
            }}
          />
        ) : (
          <div className="text-[11px] uppercase tracking-[0.12em] text-sidebar-foreground/45">
            Local mode
          </div>
        )}
      </div>
    </aside>
  )
}
