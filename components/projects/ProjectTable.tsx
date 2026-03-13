"use client"

import { Button } from "@/components/ui/button"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Project } from "@/types"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PaymentTypeBadge } from "./PaymentTypeBadge"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  projects: Project[]
  onDelete: (id: string) => Promise<void> | void
}

function PaymentState({ isPaid }: { isPaid: boolean }) {
  return (
    <span
      className={
        isPaid
          ? "inline-flex h-5 items-center rounded-md bg-emerald-950 px-2 text-[11px] font-medium text-emerald-300"
          : "inline-flex h-5 items-center rounded-md bg-red-950 px-2 text-[11px] font-medium text-red-300"
      }
    >
      {isPaid ? "Paid" : "Open"}
    </span>
  )
}

export function ProjectTable({ projects, onDelete }: Props) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    setDeleteError("")

    try {
      const response = await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" })
      const payload = await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to delete project"))
      }

      await onDelete(deleteTarget.id)
      setDeleteTarget(null)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete project")
    } finally {
      setDeleting(false)
    }
  }

  if (projects.length === 0) {
    return (
      <section className="surface-panel rounded-lg px-3 py-4 text-sm text-muted-foreground">
        No projects found. Add a project or clear the current filters.
        <Button className="ml-3 h-7 rounded-md px-2.5" size="sm" onClick={() => router.push("/projects/new")}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          New project
        </Button>
      </section>
    )
  }

  return (
    <>
      <section className="surface-panel overflow-hidden rounded-lg">
        <table className="data-table">
          <thead className="bg-zinc-900/80">
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="text-right">Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th className="w-[96px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-zinc-900/55">
                <td>
                  <button
                    type="button"
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {project.title}
                  </button>
                </td>
                <td className="text-muted-foreground">{project.client.name}</td>
                <td>
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td>
                  <PaymentTypeBadge paymentType={project.paymentType} />
                </td>
                <td className="text-right font-medium tabular-nums text-foreground">
                  {formatCurrency(project.agreedAmount, project.currency)}
                </td>
                <td>
                  <PaymentState isPaid={project.isPaid} />
                </td>
                <td className="tabular-nums text-muted-foreground">{formatDate(project.dueDate)}</td>
                <td>
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-400 hover:bg-red-950 hover:text-red-300"
                      onClick={() => {
                        setDeleteError("")
                        setDeleteTarget(project)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError("")
          }
        }}
      >
        <DialogContent className="border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete <span className="font-medium text-foreground">{deleteTarget?.title}</span> permanently.
          </p>
          {deleteError ? (
            <div className="rounded-md border border-red-950 bg-red-950/60 px-3 py-2 text-sm text-red-300">
              {deleteError}
            </div>
          ) : null}
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
    </>
  )
}
