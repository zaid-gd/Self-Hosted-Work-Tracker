"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Client } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

type ClientWithStats = Client & {
  projectCount?: number
  totalAgreedAmount?: number
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ClientWithStats | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/clients")
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load clients")
      }

      setClients(payload)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load clients")
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const totalProjects = useMemo(
    () => clients.reduce((sum, client) => sum + (client.projectCount ?? 0), 0),
    [clients]
  )
  const totalPipelineValue = useMemo(
    () => clients.reduce((sum, client) => sum + (client.totalAgreedAmount ?? 0), 0),
    [clients]
  )

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    setDeleteError("")

    try {
      const response = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to delete client")
      }

      setClients((current) => current.filter((client) => client.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (issue) {
      setDeleteError(issue instanceof Error ? issue.message : "Failed to delete client")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page-wrap space-y-6">
      <section className="surface-panel overflow-hidden p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Client Ledger</p>
              <h1 className="mt-2 max-w-3xl text-4xl leading-tight text-stone-900 lg:text-5xl">
                Keep the relationship side of the business as clean as the delivery side.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                Each client card should tell you who they are, how much work sits under them, and whether that relationship is growing or quiet.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => router.push("/clients/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New client
              </Button>
              <Button variant="outline" className="border-stone-200" onClick={() => router.push("/projects")}>
                Open project desk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[28px] border border-stone-200 bg-white/80 p-5 backdrop-blur">
              <p className="eyebrow">Portfolio Snapshot</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">{clients.length}</p>
              <p className="mt-1 text-sm text-stone-600">clients currently in your network</p>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-white/80 p-5 backdrop-blur">
              <p className="eyebrow">Attached Work</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">{totalProjects}</p>
              <p className="mt-1 text-sm text-stone-600">projects connected to those relationships</p>
            </div>
            <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
              <p className="eyebrow text-emerald-700">Visible Pipeline</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-900">
                {formatCurrency(totalPipelineValue, "INR")}
              </p>
              <p className="mt-1 text-sm text-emerald-800">combined agreed value across client work</p>
            </div>
          </aside>
        </div>
      </section>

      {error ? (
        <section className="surface-panel p-5">
          <p className="eyebrow">Load Error</p>
          <p className="mt-2 text-sm leading-6 text-rose-700">{error}</p>
          <Button className="mt-4" variant="outline" onClick={fetchClients}>
            Try again
          </Button>
        </section>
      ) : null}

      {loading ? (
        <section className="surface-panel p-12 text-center text-sm text-stone-500">
          Loading clients...
        </section>
      ) : clients.length === 0 ? (
        <section className="surface-panel flex flex-col items-center justify-center p-12 text-center">
          <p className="eyebrow">No Clients Yet</p>
          <h2 className="mt-2 text-3xl text-stone-900">Start the book of business with one real contact.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
            The client ledger becomes useful once names, emails, and project load are visible together.
          </p>
          <Button className="mt-6" onClick={() => router.push("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first client
          </Button>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {clients.map((client) => (
            <article key={client.id} className="surface-panel flex flex-col gap-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Client Record</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className="mt-2 text-left text-2xl text-stone-900 transition-colors hover:text-stone-600"
                  >
                    {client.name}
                  </button>
                  <p className="mt-1 text-sm text-stone-500">{client.contactEmail || "No email saved yet"}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-stone-200 bg-white"
                    onClick={() => router.push(`/clients/${client.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    onClick={() => {
                      setDeleteError("")
                      setDeleteTarget(client)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="eyebrow">Projects</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-900">{client.projectCount ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="eyebrow">Pipeline Value</p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {formatCurrency(client.totalAgreedAmount ?? 0, "INR")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="eyebrow">Added</p>
                <p className="mt-2 text-sm text-stone-700">{formatDate(client.createdAt)}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 text-stone-600">
            Remove <span className="font-medium text-stone-900">{deleteTarget?.name}</span> from the ledger.
            Existing linked projects may block this action depending on current data rules.
          </p>
          {deleteError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {deleteError}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
