import { cn } from "@/lib/utils"
import type { PaymentType } from "@/types"

const paymentConfig: Record<PaymentType, { label: string; className: string }> = {
  UNPAID: {
    label: "Unpaid",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  PAID_ADVANCE: {
    label: "Advance",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  FREE: {
    label: "Free",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  SALARY: {
    label: "Salary",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
}

interface Props {
  paymentType: string
}

export function PaymentTypeBadge({ paymentType }: Props) {
  const config = paymentConfig[paymentType as PaymentType] ?? {
    label: paymentType,
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
