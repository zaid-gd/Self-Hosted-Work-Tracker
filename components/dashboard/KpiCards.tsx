import { formatCurrency } from "@/lib/utils"
import { AlertCircle, Briefcase, Gift, TrendingUp } from "lucide-react"

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
      title: "Active Ledger",
      subtitle: "Projects currently tracked in your desk.",
      value: totalProjects.toString(),
      icon: Briefcase,
      accent: "text-stone-700",
      chip: "bg-stone-100 text-stone-700",
    },
    {
      title: "Needs Collection",
      subtitle: "Unpaid work that still needs follow-up.",
      value: unpaidCount.toString(),
      icon: AlertCircle,
      accent: "text-amber-700",
      chip: "bg-amber-100 text-amber-700",
    },
    {
      title: "Pro Bono Load",
      subtitle: "Free work kept visible on the board.",
      value: freeCount.toString(),
      icon: Gift,
      accent: "text-slate-700",
      chip: "bg-slate-100 text-slate-700",
    },
    {
      title: "Collected Revenue",
      subtitle: "Paid work already secured.",
      value: formatCurrency(earnedAmount, currency),
      icon: TrendingUp,
      accent: "text-emerald-700",
      chip: "bg-emerald-100 text-emerald-700",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <section
          key={card.title}
          className="surface-panel flex min-h-36 flex-col justify-between p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{card.title}</p>
              <p className="mt-2 max-w-52 text-sm leading-6 text-stone-600">
                {card.subtitle}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${card.chip}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <p className={`mt-6 text-3xl font-semibold ${card.accent}`}>{card.value}</p>
        </section>
      ))}
    </div>
  )
}
