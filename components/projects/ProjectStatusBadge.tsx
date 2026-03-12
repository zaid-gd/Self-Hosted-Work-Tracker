import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/types"

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNED: {
    label: "Planned",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-stone-200 bg-stone-100 text-stone-600",
  },
}

interface Props {
  status: string
}

export function ProjectStatusBadge({ status }: Props) {
  const config = statusConfig[status as ProjectStatus] ?? {
    label: status,
    className: "border-stone-200 bg-stone-100 text-stone-600",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
