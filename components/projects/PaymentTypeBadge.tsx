import { cn } from "@/lib/utils"
import type { PaymentType } from "@/types"

const paymentConfig: Record<PaymentType, { label: string; className: string }> = {
  UNPAID: {
    label: "Unpaid",
    className: "border-red-700 bg-red-900/85 text-red-100",
  },
  PAID_ADVANCE: {
    label: "Advance",
    className: "border-amber-600 bg-amber-900/85 text-amber-100",
  },
  FREE: {
    label: "Free",
    className: "border-zinc-600 bg-zinc-700 text-zinc-100",
  },
  SALARY: {
    label: "Salary",
    className: "border-purple-700 bg-purple-900/85 text-purple-100",
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
        "inline-flex h-5 items-center rounded-md border px-2 text-[11px] font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
