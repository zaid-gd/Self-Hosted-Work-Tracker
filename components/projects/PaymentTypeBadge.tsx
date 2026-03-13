import { cn } from "@/lib/utils"
import type { PaymentType } from "@/types"

const paymentConfig: Record<PaymentType, { label: string; className: string }> = {
  UNPAID: {
    label: "Unpaid",
    className: "border-red-900 bg-red-950 text-red-300",
  },
  PAID_ADVANCE: {
    label: "Advance",
    className: "border-amber-900 bg-amber-950 text-amber-300",
  },
  FREE: {
    label: "Free",
    className: "border-zinc-700 bg-zinc-800 text-zinc-300",
  },
  SALARY: {
    label: "Salary",
    className: "border-purple-900 bg-purple-950 text-purple-300",
  },
}

interface Props {
  paymentType: string
}

export function PaymentTypeBadge({ paymentType }: Props) {
  const config = paymentConfig[paymentType as PaymentType] ?? {
    label: paymentType,
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
