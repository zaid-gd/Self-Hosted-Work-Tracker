import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency = "INR"): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateInput(date: string | Date | null | undefined): string {
  if (!date) return ""
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}

export function formatCurrencyTotals(
  totals: Record<string, number> | Array<{ currency: string; amount: number }>
): string {
  const entries = Array.isArray(totals)
    ? totals.map((total) => [total.currency, total.amount] as const)
    : Object.entries(totals)

  if (entries.length === 0) return "—"

  return entries
    .filter(([, amount]) => amount !== 0)
    .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
    .map(([currency, amount]) => formatCurrency(amount, currency))
    .join(" • ")
}
