"use client"

import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/projects": "Projects",
  "/projects/new": "New Project",
  "/clients": "Clients",
  "/clients/new": "New Client",
}

export function TopBar() {
  const pathname = usePathname()

  let title = "EditTracker"
  for (const key of Object.keys(titles)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      title = titles[key]
      if (pathname.endsWith("/edit")) title = "Edit"
      break
    }
  }

  return (
    <header className="h-12 border-b bg-white flex items-center px-6 shrink-0">
      <h1 className="text-sm font-medium text-zinc-700">{title}</h1>
    </header>
  )
}
