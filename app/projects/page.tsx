"use client"

import { KpiCards } from "@/components/dashboard/KpiCards"
import { ProjectFilters, type Filters } from "@/components/projects/ProjectFilters"
import { ProjectTable } from "@/components/projects/ProjectTable"
import { Button } from "@/components/ui/button"
import type { Client, Project } from "@/types"
import { ArrowRight, Plus, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

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
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.paymentType) params.set("paymentType", filters.paymentType)
      if (filters.clientId) params.set("clientId", filters.clientId)
      if (filters.unpaidOnly) params.set("isPaid", "false")
      params.set("sort", filters.sort)

      const [projectsResponse, clientsResponse] = await Promise.all([
        fetch(`/api/projects?${params.toString()}`),
        fetch("/api/clients"),
      ])

      const [projectsPayload, clientsPayload] = await Promise.all([
        projectsResponse.json(),
        clientsResponse.json(),
      ])

      if (!projectsResponse.ok) {
        throw new Error(projectsPayload.error ?? "Failed to load projects")
      }

      if (!clientsResponse.ok) {
        throw new Error(clientsPayload.error ?? "Failed to load clients")
      }

      setProjects(projectsPayload)
      setClients(clientsPayload)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load workspace")
      setProjects([])
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalProjects = projects.length
  const unpaidCount = projects.filter(
    (project) => project.paymentType === "UNPAID" && !project.isPaid
  ).length
  const freeCount = projects.filter((project) => project.paymentType === "FREE").length
  const earnedAmount = projects
    .filter((project) => project.isPaid && project.agreedAmount != null)
    .reduce((sum, project) => sum + (project.agreedAmount ?? 0), 0)

  const dueSoonCount = useMemo(() => {
    const now = Date.now()
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000

    return projects.filter((project) => {
      if (!project.dueDate || project.status === "DELIVERED" || project.status === "CANCELLED") {
        return false
      }

      const dueAt = new Date(project.dueDate).getTime()
      return dueAt >= now && dueAt <= sevenDaysFromNow
    }).length
  }, [projects])

  const activeClientCount = useMemo(
    () => new Set(projects.map((project) => project.client.id)).size,
    [projects]
  )

  async function handleDelete(id: string) {
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return (
    <div className="page-wrap space-y-6">
      <section className="surface-panel overflow-hidden p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Work Ledger</p>
              <h1 className="mt-2 max-w-3xl text-4xl leading-tight text-stone-900 lg:text-5xl">
                Run projects like a calm studio, not a crowded spreadsheet.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                Keep delivery status, client context, due dates, and payment posture visible in one place so the next decision stays obvious.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => router.push("/projects/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New project
              </Button>
              <Button variant="outline" className="border-stone-200" onClick={() => router.push("/clients")}>
                Review clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <aside className="rounded-[28px] border border-stone-200 bg-white/80 p-5 backdrop-blur">
            <p className="eyebrow">This Week</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Due soon</p>
                <p className="mt-2 text-3xl font-semibold text-stone-900">{dueSoonCount}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Active clients</p>
                <p className="mt-2 text-3xl font-semibold text-stone-900">{activeClientCount}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <p className="text-sm font-medium">Collection focus</p>
                </div>
                <p className="mt-2 text-sm leading-6">
                  {unpaidCount === 0
                    ? "No unpaid items are currently sitting on the board."
                    : `${unpaidCount} project${unpaidCount === 1 ? "" : "s"} still need payment follow-up.`}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <KpiCards
        totalProjects={totalProjects}
        unpaidCount={unpaidCount}
        freeCount={freeCount}
        earnedAmount={earnedAmount}
        currency="INR"
      />

      <ProjectFilters clients={clients} filters={filters} onChange={setFilters} />

      {error ? (
        <section className="surface-panel p-5">
          <p className="eyebrow">Load Error</p>
          <p className="mt-2 text-sm leading-6 text-rose-700">{error}</p>
          <Button className="mt-4" variant="outline" onClick={fetchData}>
            Try again
          </Button>
        </section>
      ) : null}

      {loading ? (
        <section className="surface-panel p-12 text-center text-sm text-stone-500">
          Loading projects...
        </section>
      ) : (
        <ProjectTable projects={projects} onDelete={handleDelete} />
      )}
    </div>
  )
}
