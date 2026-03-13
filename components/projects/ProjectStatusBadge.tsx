import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/types"

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNED: {
    label: "Planned",
    className: "border-zinc-700 bg-zinc-800 text-zinc-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "border-blue-900 bg-blue-950 text-blue-300",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-900 bg-emerald-950 text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-zinc-800 bg-zinc-900 text-zinc-500",
  },
}

interface Props {
  status: string
}

export function ProjectStatusBadge({ status }: Props) {
  const config = statusConfig[status as ProjectStatus] ?? {
    label: status,
    className: "border-zinc-800 bg-zinc-900 text-zinc-400",
  }

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2.5 text-[11px] font-medium tracking-[0.02em]",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
