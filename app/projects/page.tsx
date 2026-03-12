"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { ProjectTable } from "@/components/projects/ProjectTable"
import { ProjectFilters, type Filters } from "@/components/projects/ProjectFilters"
import { Button } from "@/components/ui/button"
import type { Client, Project } from "@/types"
import { Plus } from "lucide-react"

const DEFAULT_FILTERS: Filters = {
  search: "",
  status: "",
  paymentType: "",
  clientId: "",
  unpaidOnly: false,
  sort: "createdAt_desc",
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.paymentType) params.set("paymentType", filters.paymentType)
      if (filters.clientId) params.set("clientId", filters.clientId)
      if (filters.unpaidOnly) params.set("isPaid", "false")
      params.set("sort", filters.sort)

      const [projectsRes, clientsRes] = await Promise.all([
        fetch(`/api/projects?${params.toString()}`),
        fetch("/api/clients"),
      ])

      const [projectsData, clientsData] = await Promise.all([
        projectsRes.json(),
        clientsRes.json(),
      ])

      setProjects(projectsData)
      setClients(clientsData)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // KPI calculations
  const totalProjects = projects.length
  const unpaidCount = projects.filter(
    (p) => p.paymentType === "UNPAID" && !p.isPaid
  ).length
  const freeCount = projects.filter((p) => p.paymentType === "FREE").length
  const earnedAmount = projects
    .filter((p) => p.isPaid && p.agreedAmount != null)
    .reduce((sum, p) => sum + (p.agreedAmount ?? 0), 0)

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Projects</h1>
          <p className="text-sm text-zinc-500">
            {loading ? "Loading..." : `${projects.length} projects`}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => router.push("/projects/new")}
        >
          <Plus className="w-4 h-4 mr-1" />
          New Project
        </Button>
      </div>

      {/* KPI Cards */}
      <KpiCards
        totalProjects={totalProjects}
        unpaidCount={unpaidCount}
        freeCount={freeCount}
        earnedAmount={earnedAmount}
        currency="INR"
      />

      {/* Filters */}
      <ProjectFilters
        clients={clients}
        filters={filters}
        onChange={setFilters}
      />

      {/* Table */}
      {loading ? (
        <div className="bg-white border rounded-lg p-12 text-center text-zinc-400 text-sm">
          Loading projects...
        </div>
      ) : (
        <ProjectTable projects={projects} onDelete={handleDelete} />
      )}
    </div>
  )
}
