import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/types"

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  PLANNED: {
    label: "Planned",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  },
}

interface Props {
  status: string
}

export function ProjectStatusBadge({ status }: Props) {
  const config = statusConfig[status as ProjectStatus] ?? {
    label: status,
    className: "bg-zinc-100 text-zinc-600 border border-zinc-200",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
