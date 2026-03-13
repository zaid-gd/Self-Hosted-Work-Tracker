import { formatCurrency } from "@/lib/utils"

interface Props {
  totalProjects: number
  unpaidCount: number
  freeCount: number
  earnedAmount: number
  currency: string
}

export function KpiCards({
  totalProjects,
  unpaidCount,
  freeCount,
  earnedAmount,
  currency,
}: Props) {
  const cards = [
    { label: "Total Projects", value: totalProjects.toString(), valueClass: "text-foreground" },
    { label: "Unpaid", value: unpaidCount.toString(), valueClass: "text-red-400" },
    {
      label: "Earned",
      value: formatCurrency(earnedAmount, currency),
      valueClass: "text-emerald-400",
    },
    { label: "Free Work", value: freeCount.toString(), valueClass: "text-zinc-500" },
  ]

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <section key={card.label} className="surface-panel rounded-lg px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-medium tabular-nums ${card.valueClass}`}>
            {card.value}
          </p>
        </section>
      ))}
    </div>
  )
}
