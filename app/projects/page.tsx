"use client"

import { KpiCards } from "@/components/dashboard/KpiCards"
import { ProjectFilters, type Filters } from "@/components/projects/ProjectFilters"
import { ProjectTable } from "@/components/projects/ProjectTable"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import type { Client, Project } from "@/types"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

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

  const fetchProjects = useCallback(async () => {
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

      const projectsResponse = await fetch(`/api/projects?${params.toString()}`)
      const projectsPayload = await readApiPayload(projectsResponse)

      if (!projectsResponse.ok) {
        throw new Error(
          getApiErrorMessage(projectsResponse, projectsPayload, "Failed to load projects")
        )
      }

      setProjects(Array.isArray(projectsPayload) ? projectsPayload : [])
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load projects")
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchClients = useCallback(async () => {
    try {
      const clientsResponse = await fetch("/api/clients")
      const clientsPayload = await readApiPayload(clientsResponse)

      if (!clientsResponse.ok) {
        throw new Error(
          getApiErrorMessage(clientsResponse, clientsPayload, "Failed to load clients")
        )
      }

      setClients(Array.isArray(clientsPayload) ? clientsPayload : [])
    } catch {
      setClients([])
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const totalProjects = projects.length
  const unpaidCount = projects.filter(
    (project) => project.paymentType === "UNPAID" && !project.isPaid
  ).length
  const freeCount = projects.filter((project) => project.paymentType === "FREE").length
  const earnedAmount = projects
    .filter((project) => project.isPaid && project.agreedAmount != null)
    .reduce((sum, project) => sum + (project.agreedAmount ?? 0), 0)

  async function handleDelete(id: string) {
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="text-base font-medium text-foreground">Projects</h1>
        <Button className="h-8 rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/90" size="sm" onClick={() => router.push("/projects/new")}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          New Project
        </Button>
      </div>

      <KpiCards
        totalProjects={totalProjects}
        unpaidCount={unpaidCount}
        freeCount={freeCount}
        earnedAmount={earnedAmount}
        currency="INR"
      />

      <ProjectFilters clients={clients} filters={filters} onChange={setFilters} />

      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading projects...</div>
      ) : (
        <ProjectTable projects={projects} onDelete={handleDelete} />
      )}
    </div>
  )
}
