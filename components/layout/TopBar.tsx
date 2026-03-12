"use client"

import { usePathname } from "next/navigation"
import { CalendarDays, PanelLeftOpen } from "lucide-react"

const titles: Record<string, { title: string; subtitle: string }> = {
  "/projects": {
    title: "Production Board",
    subtitle: "Track current edits, pending approvals, and paid delivery work.",
  },
  "/projects/new": {
    title: "New Project",
    subtitle: "Open a fresh editing job with ownership, dates, and payment terms.",
  },
  "/clients": {
    title: "Client Directory",
    subtitle: "Keep studios and repeat collaborators visible and easy to manage.",
  },
  "/clients/new": {
    title: "New Client",
    subtitle: "Create a client profile before attaching work and delivery files.",
  },
}

export function TopBar() {
  const pathname = usePathname()

  let title = "EditTracker"
  let subtitle = "Manage the business side of editing without leaving the workspace."
  for (const key of Object.keys(titles)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      title = titles[key].title
      subtitle = titles[key].subtitle
      if (pathname.endsWith("/edit")) {
        title = "Editing Workspace"
        subtitle = "Refine the record, tighten dates, and keep the handoff clean."
      }
      break
    }
  }

  const today = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date())

  return (
    <header className="relative z-10 border-b border-border/70 bg-background/75 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full border border-border/70 bg-card/80 p-2 text-muted-foreground lg:hidden">
            <PanelLeftOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="mt-1 text-2xl text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm sm:flex">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{today}</span>
        </div>
      </div>
    </header>
  )
}
