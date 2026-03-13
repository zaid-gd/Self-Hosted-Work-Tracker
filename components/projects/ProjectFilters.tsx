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
  { value: "", label: "All" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
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
    }, 220)

    return () => clearTimeout(timer)
  }, [filters, onChange, search])

  return (
    <section className="surface-panel rounded-lg px-3 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ ...filters, status: tab.value })}
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                filters.status === tab.value
                  ? "border-zinc-700 bg-zinc-800 text-zinc-100"
                  : "border-border bg-background text-muted-foreground hover:bg-zinc-900 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[220px_150px_170px_150px_auto]">
          <Input
            placeholder="Search title or notes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 rounded-md border-border bg-background text-sm"
          />

          <Select
            value={filters.paymentType || "ALL"}
            onValueChange={(value) =>
              onChange({ ...filters, paymentType: !value || value === "ALL" ? "" : value })
            }
          >
            <SelectTrigger className="h-8 rounded-md border-border bg-background text-sm">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All payment</SelectItem>
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
            <SelectTrigger className="h-8 rounded-md border-border bg-background text-sm">
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
            <SelectTrigger className="h-8 rounded-md border-border bg-background text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Newest</SelectItem>
              <SelectItem value="createdAt_asc">Oldest</SelectItem>
              <SelectItem value="dueDate_asc">Due date</SelectItem>
              <SelectItem value="agreedAmount_desc">Highest value</SelectItem>
              <SelectItem value="clientName_asc">Client A-Z</SelectItem>
            </SelectContent>
          </Select>

          <label className="flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={filters.unpaidOnly}
              onChange={(event) => onChange({ ...filters, unpaidOnly: event.target.checked })}
              className="rounded border-zinc-700 bg-transparent"
            />
            Unpaid only
          </label>
        </div>
      </div>
    </section>
  )
}
