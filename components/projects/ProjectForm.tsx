"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import { formatDateInput } from "@/lib/utils"
import type { Client, Project } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

interface Props {
  clients: Client[]
  project?: Project
}

type FormErrors = Partial<Record<"title" | "clientId" | "agreedAmount" | "notes" | "contact", string>>

export function ProjectForm({ clients, project }: Props) {
  const router = useRouter()
  const isEdit = Boolean(project)
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
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  const amountVisible = useMemo(
    () => form.paymentType !== "FREE" && form.paymentType !== "SALARY",
    [form.paymentType]
  )

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setServerError("")
  }

  function validate() {
    const nextErrors: FormErrors = {}

    if (!form.title.trim()) nextErrors.title = "Title is required."
    if (!form.clientId) nextErrors.clientId = "Client is required."

    if (amountVisible) {
      const amount = Number(form.agreedAmount)
      if (!form.agreedAmount.trim()) {
        nextErrors.agreedAmount = "Amount is required."
      } else if (Number.isNaN(amount) || amount <= 0) {
        nextErrors.agreedAmount = "Amount must be greater than zero."
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setSaving(true)
    setServerError("")

    try {
      const body = {
        ...form,
        agreedAmount: amountVisible ? Number(form.agreedAmount) : null,
        dueDate: form.dueDate || null,
      }

      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const payload = response.ok ? null : await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to save project"))
      }

      router.push("/projects")
      router.refresh()
    } catch (issue: unknown) {
      setServerError(issue instanceof Error ? issue.message : "Failed to save project")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
            Title
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="Wedding highlight film"
            className="h-9 rounded-md border-border bg-background"
          />
          {errors.title ? <p className="mt-1 text-xs text-red-300">{errors.title}</p> : null}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <Label htmlFor="clientId" className="text-xs font-medium uppercase text-muted-foreground">
              Client
            </Label>
            <Link href="/clients/new" className="text-xs font-medium text-primary">
              New client
            </Link>
          </div>
          <Select value={form.clientId} onValueChange={(value) => set("clientId", value ?? "")}>
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
          {errors.clientId ? <p className="mt-1 text-xs text-red-300">{errors.clientId}</p> : null}
          {clients.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Create a client before saving this project.
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="status" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
            Status
          </Label>
          <Select value={form.status} onValueChange={(value) => set("status", value ?? "PLANNED")}>
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
          <Label htmlFor="paymentType" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
            Payment Type
          </Label>
          <Select
            value={form.paymentType}
            onValueChange={(value) => {
              set("paymentType", value ?? "UNPAID")
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
            <Label htmlFor="agreedAmount" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
              Amount
            </Label>
            <div className="flex gap-2">
              <Select value={form.currency} onValueChange={(value) => set("currency", value ?? "INR")}>
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
            {errors.agreedAmount ? <p className="mt-1 text-xs text-red-300">{errors.agreedAmount}</p> : null}
          </div>
        ) : (
          <div>
            <Label className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
              Amount
            </Label>
            <div className="flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
              Hidden for this payment type
            </div>
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

        <div className="md:col-span-2">
          <Label htmlFor="tags" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
            Tags
          </Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(event) => set("tags", event.target.value)}
            placeholder="wedding, highlight, reels"
            className="h-9 rounded-md border-border bg-background"
          />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated tags</p>
        </div>

        <div>
          <Label htmlFor="dueDate" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
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

        <div className="md:col-span-2">
          <Label htmlFor="notes" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
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

      {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" className="h-8 rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/90" size="sm" disabled={saving || !clients.length}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" className="h-8 rounded-md px-3" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
