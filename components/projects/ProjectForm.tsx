"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDateInput } from "@/lib/utils"
import type { Client, Project } from "@/types"

interface Props {
  clients: Client[]
  project?: Project
}

export function ProjectForm({ clients, project }: Props) {
  const router = useRouter()
  const isEdit = !!project

  const [form, setForm] = useState({
    title: project?.title ?? "",
    clientId: project?.clientId ?? "",
    status: project?.status ?? "PLANNED",
    paymentType: project?.paymentType ?? "UNPAID",
    agreedAmount: project?.agreedAmount?.toString() ?? "",
    currency: project?.currency ?? "INR",
    isPaid: project?.isPaid ?? false,
    tags: project?.tags ?? "",
    notes: project?.notes ?? "",
    dueDate: formatDateInput(project?.dueDate),
    completedAt: formatDateInput(project?.completedAt),
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const body = {
        ...form,
        agreedAmount: form.agreedAmount ? parseFloat(form.agreedAmount) : null,
        dueDate: form.dueDate || null,
        completedAt: form.completedAt || null,
      }

      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to save project")
      }

      router.push("/projects")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Wedding Highlight Film"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="clientId">Client *</Label>
          <Select
            value={form.clientId}
            onValueChange={(v) => set("clientId", v)}
            required
          >
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLANNED">Planned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paymentType">Payment Type</Label>
          <Select value={form.paymentType} onValueChange={(v) => set("paymentType", v)}>
            <SelectTrigger id="paymentType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
              <SelectItem value="PAID_ADVANCE">Paid Advance</SelectItem>
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="SALARY">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="agreedAmount">Agreed Amount</Label>
          <div className="flex gap-2">
            <Select
              value={form.currency}
              onValueChange={(v) => set("currency", v)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="agreedAmount"
              type="number"
              value={form.agreedAmount}
              onChange={(e) => set("agreedAmount", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="completedAt">Completed At</Label>
          <Input
            id="completedAt"
            type="date"
            value={form.completedAt}
            onChange={(e) => set("completedAt", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="wedding, highlight, reels"
          />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            id="isPaid"
            type="checkbox"
            checked={form.isPaid}
            onChange={(e) => set("isPaid", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="isPaid" className="cursor-pointer">Mark as Paid</Label>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set("notes", e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
