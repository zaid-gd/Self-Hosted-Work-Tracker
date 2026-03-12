import { cn } from "@/lib/utils"
import type { PaymentType } from "@/types"

const paymentConfig: Record<
  PaymentType,
  { label: string; className: string }
> = {
  UNPAID: {
    label: "Unpaid",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
  PAID_ADVANCE: {
    label: "Advance",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  FREE: {
    label: "Free",
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  },
  SALARY: {
    label: "Salary",
    className: "bg-violet-100 text-violet-700 border border-violet-200",
  },
}

interface Props {
  paymentType: string
}

export function PaymentTypeBadge({ paymentType }: Props) {
  const config = paymentConfig[paymentType as PaymentType] ?? {
    label: paymentType,
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
