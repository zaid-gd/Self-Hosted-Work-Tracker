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

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      onChange({ ...filters, search })
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="space-y-3">
      {/* Status Tabs */}
      <div className="flex gap-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange({ ...filters, status: tab.value })}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filters.status === tab.value
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52 h-8 text-sm"
        />

        <Select
          value={filters.paymentType}
          onValueChange={(v) => onChange({ ...filters, paymentType: (v === "ALL" ? "" : v) as string })}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PAID_ADVANCE">Paid Advance</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="SALARY">Salary</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.clientId}
          onValueChange={(v) => onChange({ ...filters, clientId: (v === "ALL" ? "" : v) as string })}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(v) => onChange({ ...filters, sort: v as SortOption })}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest</SelectItem>
            <SelectItem value="createdAt_asc">Oldest</SelectItem>
            <SelectItem value="dueDate_asc">Due Date</SelectItem>
            <SelectItem value="agreedAmount_desc">Highest Value</SelectItem>
            <SelectItem value="clientName_asc">Client A-Z</SelectItem>
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.unpaidOnly}
            onChange={(e) => onChange({ ...filters, unpaidOnly: e.target.checked })}
            className="rounded"
          />
          Show only unpaid
        </label>
      </div>
    </div>
  )
}
