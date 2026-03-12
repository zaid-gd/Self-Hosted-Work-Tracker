"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderOpen, Users, Clapperboard } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/clients", label: "Clients", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col h-screen w-56 border-r bg-zinc-950 text-zinc-100 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-zinc-800">
        <Clapperboard className="w-5 h-5 text-violet-400" />
        <span className="font-semibold text-sm tracking-wide">EditTracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">EditTracker</p>
        <p className="text-xs text-zinc-600">v0.1.0</p>
      </div>
    </aside>
  )
}
