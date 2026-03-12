"use client"

import { useRouter } from "next/navigation"
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import { PaymentTypeBadge } from "./PaymentTypeBadge"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Project } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  projects: Project[]
  onDelete: (id: string) => void
}

export function ProjectTable({ projects, onDelete }: Props) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" })
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-12 text-center">
        <p className="text-zinc-500 text-sm mb-3">No projects found</p>
        <Button
          size="sm"
          onClick={() => router.push("/projects/new")}
        >
          + Add your first project
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Payment</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Paid</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Due</th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-zinc-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="text-zinc-900 font-medium hover:text-violet-600 text-left"
                  >
                    {project.title}
                  </button>
                  {project.tags && (
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {project.tags.split(",").filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{project.client.name}</td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentTypeBadge paymentType={project.paymentType} />
                </td>
                <td className="px-4 py-3 text-right text-zinc-700 font-mono text-xs">
                  {project.agreedAmount != null
                    ? formatCurrency(project.agreedAmount, project.currency)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {project.isPaid ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 inline" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 inline" />
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {formatDate(project.dueDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteTarget(project)}
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

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete{" "}
            <span className="font-medium">&quot;{deleteTarget?.title}&quot;</span>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
