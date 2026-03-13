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
    {
      label: "Total Projects",
      value: totalProjects.toString(),
      valueClass: "text-foreground",
    },
    {
      label: "Unpaid",
      value: unpaidCount.toString(),
      valueClass: "text-red-300",
    },
    {
      label: "Earned",
      value: formatCurrency(earnedAmount, currency),
      valueClass: "text-emerald-400",
    },
    {
      label: "Free Work",
      value: freeCount.toString(),
      valueClass: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <section key={card.label} className="metric-card">
          <p className="metric-label">{card.label}</p>
          <p className={`metric-value ${card.valueClass}`}>{card.value}</p>
        </section>
      ))}
    </div>
  )
}
