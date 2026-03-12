"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Project } from "@/types"
import { CheckCircle2, Pencil, Plus, Trash2, XCircle } from "lucide-react"
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

function getTagList(tags: string | null | undefined) {
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
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
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to delete project")
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
      <section className="surface-panel flex flex-col items-center justify-center p-12 text-center">
        <p className="eyebrow">No Work Yet</p>
        <h2 className="mt-2 text-3xl text-stone-900">Your board is ready for the first assignment.</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
          Start with one real project. The dashboard becomes useful as soon as due dates, payment posture, and client context are visible in one place.
        </p>
        <Button className="mt-6" onClick={() => router.push("/projects/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add your first project
        </Button>
      </section>
    )
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => {
          const tags = getTagList(project.tags)

          return (
            <article
              key={project.id}
              className="surface-panel flex flex-col gap-5 p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ProjectStatusBadge status={project.status} />
                    <PaymentTypeBadge paymentType={project.paymentType} />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="text-left text-2xl text-stone-900 transition-colors hover:text-stone-600"
                    >
                      {project.title}
                    </button>
                    <p className="mt-1 text-sm text-stone-500">{project.client.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-stone-200 bg-white"
                    onClick={() => router.push(`/projects/${project.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    onClick={() => {
                      setDeleteError("")
                      setDeleteTarget(project)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="eyebrow">Value</p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {formatCurrency(project.agreedAmount, project.currency)}
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="eyebrow">Due Date</p>
                  <p className="mt-2 text-lg font-semibold text-stone-900">
                    {formatDate(project.dueDate)}
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="eyebrow">Paid</p>
                  <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-stone-900">
                    {project.isPaid ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500" />
                    )}
                    <span>{project.isPaid ? "Settled" : "Open"}</span>
                  </div>
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {project.notes ? (
                <p className="line-clamp-3 text-sm leading-6 text-stone-600">{project.notes}</p>
              ) : null}
            </article>
          )
        })}
      </div>

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
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 text-stone-600">
            Remove <span className="font-medium text-stone-900">{deleteTarget?.title}</span> from the desk.
            This cannot be undone.
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
              {deleting ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
