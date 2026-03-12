"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Client } from "@/types"
import { Pencil, Trash2, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<(Client & { projectCount?: number; totalAgreedAmount?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/clients")
      const data = await res.json()
      setClients(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" })
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Clients</h1>
          <p className="text-sm text-zinc-500">
            {loading ? "Loading..." : `${clients.length} clients`}
          </p>
        </div>
        <Button size="sm" onClick={() => router.push("/clients/new")}>
          <Plus className="w-4 h-4 mr-1" />
          New Client
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border rounded-lg p-12 text-center text-zinc-400 text-sm">
          Loading clients...
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-zinc-500 text-sm mb-3">No clients yet</p>
          <Button size="sm" onClick={() => router.push("/clients/new")}>
            + Add your first client
          </Button>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Email</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Projects</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Added</th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900">{client.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{client.contactEmail ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-zinc-600">{client.projectCount ?? 0}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => router.push(`/clients/${client.id}/edit`)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(client)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete{" "}
            <span className="font-medium">&quot;{deleteTarget?.name}&quot;</span>? All associated projects
            will also be deleted.
          </p>
          <DialogFooter>
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
