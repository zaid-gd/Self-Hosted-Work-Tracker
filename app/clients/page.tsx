"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import { formatCurrency } from "@/lib/utils"
import type { Client } from "@/types"
import { Pencil, Plus, Trash2 } from "lucide-react"
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
      const payload = await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to load clients"))
      }

      setClients(Array.isArray(payload) ? payload : [])
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

  const totalValue = useMemo(
    () => clients.reduce((sum, client) => sum + (client.totalAgreedAmount ?? 0), 0),
    [clients]
  )

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    setDeleteError("")

    try {
      const response = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" })
      const payload = await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to delete client"))
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
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="text-base font-medium text-foreground">Clients</h1>
        <Button className="h-8 rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/90" size="sm" onClick={() => router.push("/clients/new")}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          New Client
        </Button>
      </div>

      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="text-sm text-muted-foreground">No clients found.</div>
      ) : (
        <section className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Email</th>
                <th className="text-right">Projects</th>
                <th className="text-right">Total Value</th>
                <th className="w-[88px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="group hover:bg-background/80">
                  <td>
                    <button
                      type="button"
                      onClick={() => router.push(`/clients/${client.id}`)}
                      className="table-row-link"
                    >
                      {client.name}
                    </button>
                  </td>
                  <td className="text-muted-foreground">{client.contactEmail || "-"}</td>
                  <td className="text-right tabular-nums text-foreground">{client.projectCount ?? 0}</td>
                  <td className="text-right font-medium tabular-nums text-foreground">
                    {formatCurrency(client.totalAgreedAmount ?? 0, "INR")}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                        aria-label={`Edit ${client.name}`}
                        onClick={() => router.push(`/clients/${client.id}/edit`)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-red-400 hover:bg-red-950 hover:text-red-300"
                        aria-label={`Delete ${client.name}`}
                        onClick={() => {
                          setDeleteError("")
                          setDeleteTarget(client)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border-t border-border px-3 py-2 text-[11px] font-medium uppercase text-muted-foreground">
                  Total
                </td>
                <td className="border-t border-border px-3 py-2" />
                <td className="border-t border-border px-3 py-2 text-right tabular-nums text-muted-foreground">
                  {clients.reduce((sum, client) => sum + (client.projectCount ?? 0), 0)}
                </td>
                <td className="border-t border-border px-3 py-2 text-right font-medium tabular-nums text-foreground">
                  {formatCurrency(totalValue, "INR")}
                </td>
                <td className="border-t border-border px-3 py-2" />
              </tr>
            </tfoot>
          </table>
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
        <DialogContent className="border-border bg-card text-foreground sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Delete client?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{deleteTarget?.name}</p>
          {deleteError ? <p className="text-sm text-red-300">{deleteError}</p> : null}
          <DialogFooter className="border-0 bg-transparent p-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
