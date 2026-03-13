import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/types"

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNED: {
    label: "Planned",
    className: "border-zinc-600 bg-zinc-700 text-zinc-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "border-blue-700 bg-blue-900/80 text-blue-100",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-700 bg-emerald-900/80 text-emerald-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-zinc-800 bg-zinc-900 text-zinc-400",
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
        "inline-flex h-5 items-center rounded-md border px-2 text-[11px] font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
