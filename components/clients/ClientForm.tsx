"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
import type { Client } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  client?: Client
}

export function ClientForm({ client }: Props) {
  const router = useRouter()
  const isEdit = !!client

  const [form, setForm] = useState({
    name: client?.name ?? "",
    contactEmail: client?.contactEmail ?? "",
    notes: client?.notes ?? "",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSaving(true)

    try {
      const url = isEdit ? `/api/clients/${client!.id}` : "/api/clients"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const payload = await readApiPayload(response)
        throw new Error(getApiErrorMessage(response, payload, "Failed to save client"))
      }

      router.push("/clients")
      router.refresh()
    } catch (issue: unknown) {
      setError(issue instanceof Error ? issue.message : "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Studio or client name"
            required
            className="h-9 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="contactEmail" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Contact Email
          </Label>
          <Input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(event) => set("contactEmail", event.target.value)}
            placeholder="contact@studio.com"
            className="h-9 rounded-md border-border bg-background"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => set("notes", event.target.value)}
            placeholder="Anything worth remembering about this client"
            rows={5}
            className="rounded-md border-border bg-background"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" className="h-8 rounded-md px-3" size="sm" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Client"}
        </Button>
        <Button type="button" variant="outline" className="h-8 rounded-md px-3" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
