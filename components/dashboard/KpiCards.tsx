import { formatCurrency } from "@/lib/utils"
import { Briefcase, AlertCircle, Gift, TrendingUp } from "lucide-react"

interface Props {
  totalProjects: number
  unpaidCount: number
  freeCount: number
  earnedAmount: number
  currency: string
}

export function KpiCards({ totalProjects, unpaidCount, freeCount, earnedAmount, currency }: Props) {
  const cards = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      icon: Briefcase,
      iconClass: "text-zinc-500",
      valueClass: "text-zinc-900",
    },
    {
      title: "Unpaid/Pending",
      value: unpaidCount.toString(),
      icon: AlertCircle,
      iconClass: "text-red-500",
      valueClass: "text-red-600",
    },
    {
      title: "Free Work",
      value: freeCount.toString(),
      icon: Gift,
      iconClass: "text-zinc-400",
      valueClass: "text-zinc-500",
    },
    {
      title: "Earned (Paid)",
      value: formatCurrency(earnedAmount, currency),
      icon: TrendingUp,
      iconClass: "text-emerald-500",
      valueClass: "text-emerald-700",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border rounded-lg p-4 flex items-center gap-4"
        >
          <div className={`shrink-0 ${card.iconClass}`}>
            <card.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium">{card.title}</p>
            <p className={`text-xl font-bold ${card.valueClass}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
