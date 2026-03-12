"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Clapperboard, CloudUpload, FolderOpen, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/clients", label: "Clients", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="relative z-10 hidden h-screen w-72 shrink-0 border-r border-sidebar-border/70 bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="border-b border-sidebar-border/70 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/55">Studio Desk</p>
            <span className="text-base font-semibold tracking-wide">EditTracker</span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-sidebar-foreground/55">Operating mode</p>
          <p className="mt-2 text-sm leading-6 text-sidebar-foreground/85">
            One place for client work, payment follow-up, and cloud-delivered files.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-sidebar-primary">
            <CloudUpload className="h-3.5 w-3.5" />
            Supabase-backed delivery vault
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
              <ArrowUpRight className={cn("h-3.5 w-3.5 opacity-0 transition", active && "opacity-100")} />
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border/70 px-5 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/60 px-3 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sidebar-foreground/50">Session</p>
            <p className="text-sm text-sidebar-foreground/85">Authenticated workspace</p>
          </div>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </aside>
  )
}
