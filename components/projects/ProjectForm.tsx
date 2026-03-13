"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatDateInput } from "@/lib/utils"
import type { Client, Project } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  clients: Client[]
  project?: Project
}

export function ProjectForm({ clients, project }: Props) {
  const router = useRouter()
  const isEdit = !!project
  const showAmount = project?.paymentType
    ? project.paymentType !== "FREE" && project.paymentType !== "SALARY"
    : true

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

  const amountVisible = form.paymentType !== "FREE" && form.paymentType !== "SALARY"

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSaving(true)

    try {
      const body = {
        ...form,
        agreedAmount: amountVisible && form.agreedAmount ? parseFloat(form.agreedAmount) : null,
        dueDate: form.dueDate || null,
        completedAt: form.completedAt || null,
      }

      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const payload = await readApiPayload(response)
        throw new Error(getApiErrorMessage(response, payload, "Failed to save project"))
      }

      router.push("/projects")
      router.refresh()
    } catch (issue: unknown) {
      setError(issue instanceof Error ? issue.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Title
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="Wedding highlight film"
            required
            className="h-9 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <Label htmlFor="clientId" className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Client
            </Label>
            <Link href="/clients/new" className="text-[11px] font-medium text-primary hover:text-amber-300">
              New client
            </Link>
          </div>
          <Select value={form.clientId} onValueChange={(value) => set("clientId", value)}>
            <SelectTrigger id="clientId" className="h-9 rounded-md border-border bg-background text-sm">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Status
          </Label>
          <Select value={form.status} onValueChange={(value) => set("status", value)}>
            <SelectTrigger id="status" className="h-9 rounded-md border-border bg-background text-sm">
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

        <div>
          <Label htmlFor="paymentType" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Payment Type
          </Label>
          <Select
            value={form.paymentType}
            onValueChange={(value) => {
              set("paymentType", value)
              if (value === "FREE" || value === "SALARY") {
                set("agreedAmount", "")
              }
            }}
          >
            <SelectTrigger id="paymentType" className="h-9 rounded-md border-border bg-background text-sm">
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

        {amountVisible ? (
          <div>
            <Label htmlFor="agreedAmount" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Amount
            </Label>
            <div className="flex gap-2">
              <Select value={form.currency} onValueChange={(value) => set("currency", value)}>
                <SelectTrigger className="h-9 w-24 rounded-md border-border bg-background text-sm">
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
                onChange={(event) => set("agreedAmount", event.target.value)}
                placeholder="0"
                min="0"
                className="h-9 rounded-md border-border bg-background tabular-nums"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-end">
            <p className="text-xs text-muted-foreground">
              Amount is hidden for <span className="text-foreground">{form.paymentType.toLowerCase()}</span> work.
            </p>
          </div>
        )}

        <div className="flex items-end">
          <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
            <input
              id="isPaid"
              type="checkbox"
              checked={form.isPaid}
              onChange={(event) => set("isPaid", event.target.checked)}
              className="rounded border-zinc-700 bg-transparent"
            />
            Paid
          </label>
        </div>

        <div>
          <Label htmlFor="tags" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Tags
          </Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(event) => set("tags", event.target.value)}
            placeholder="wedding, highlight, reels"
            className="h-9 rounded-md border-border bg-background"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Comma-separated tags</p>
        </div>

        <div>
          <Label htmlFor="dueDate" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(event) => set("dueDate", event.target.value)}
            className="h-9 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="completedAt" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Completed At
          </Label>
          <Input
            id="completedAt"
            type="date"
            value={form.completedAt}
            onChange={(event) => set("completedAt", event.target.value)}
            className="h-9 rounded-md border-border bg-background"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set("notes", event.target.value)}
            placeholder="Notes, scope, or delivery details"
            rows={5}
            className="rounded-md border-border bg-background"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" className="h-8 rounded-md px-3" size="sm" disabled={saving || !form.clientId}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" className="h-8 rounded-md px-3" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
