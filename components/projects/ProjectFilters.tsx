"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Client, SortOption } from "@/types"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

export interface Filters {
  search: string
  status: string
  paymentType: string
  clientId: string
  unpaidOnly: boolean
  sort: SortOption
}

interface Props {
  clients: Client[]
  filters: Filters
  onChange: (filters: Filters) => void
}

const STATUS_TABS = [
  { value: "", label: "All work" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
]

export function ProjectFilters({ clients, filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search)

  useEffect(() => {
    setSearch(filters.search)
  }, [filters.search])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search })
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, onChange, search])

  return (
    <section className="surface-panel p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Project Lens</p>
            <h2 className="mt-1 text-2xl text-stone-900">Shape the board around what matters now.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            Filter by state, payment posture, and client so the queue shows what needs action instead of raw volume.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ ...filters, status: tab.value })}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filters.status === tab.value
                  ? "border-stone-900 bg-stone-900 text-stone-50"
                  : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-stone-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Search project title or notes"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 border-stone-200 bg-white pl-9 text-sm"
            />
          </div>

          <Select
            value={filters.paymentType || "ALL"}
            onValueChange={(value) =>
              onChange({ ...filters, paymentType: !value || value === "ALL" ? "" : value })
            }
          >
            <SelectTrigger className="h-11 border-stone-200 bg-white text-sm">
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All payment types</SelectItem>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
              <SelectItem value="PAID_ADVANCE">Advance</SelectItem>
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="SALARY">Salary</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.clientId || "ALL"}
            onValueChange={(value) =>
              onChange({ ...filters, clientId: !value || value === "ALL" ? "" : value })
            }
          >
            <SelectTrigger className="h-11 border-stone-200 bg-white text-sm">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onChange({ ...filters, sort: (value ?? "createdAt_desc") as SortOption })
            }
          >
            <SelectTrigger className="h-11 border-stone-200 bg-white text-sm">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Newest first</SelectItem>
              <SelectItem value="createdAt_asc">Oldest first</SelectItem>
              <SelectItem value="dueDate_asc">Due soonest</SelectItem>
              <SelectItem value="agreedAmount_desc">Highest value</SelectItem>
              <SelectItem value="clientName_asc">Client A-Z</SelectItem>
            </SelectContent>
          </Select>

          <label className="flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={filters.unpaidOnly}
              onChange={(event) =>
                onChange({ ...filters, unpaidOnly: event.target.checked })
              }
              className="rounded border-stone-300"
            />
            Unpaid only
          </label>
        </div>
      </div>
    </section>
  )
}
