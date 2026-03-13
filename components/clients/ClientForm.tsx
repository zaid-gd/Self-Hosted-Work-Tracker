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

type FormErrors = Partial<Record<"name" | "contactEmail", string>>

export function ClientForm({ client }: Props) {
  const router = useRouter()
  const isEdit = Boolean(client)
  const [form, setForm] = useState({
    name: client?.name ?? "",
    contactEmail: client?.contactEmail ?? "",
    notes: client?.notes ?? "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState("")
  const [saving, setSaving] = useState(false)

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setServerError("")
  }

  function validate() {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = "Name is required."
    if (form.contactEmail.trim() && !/\S+@\S+\.\S+/.test(form.contactEmail)) {
      nextErrors.contactEmail = "Enter a valid email."
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
      const url = isEdit ? `/api/clients/${client!.id}` : "/api/clients"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const payload = response.ok ? null : await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to save client"))
      }

      router.push("/clients")
      router.refresh()
    } catch (issue: unknown) {
      setServerError(issue instanceof Error ? issue.message : "Failed to save client")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Studio or client name"
            className="h-9 rounded-md border-border bg-background"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-300">{errors.name}</p> : null}
        </div>

        <div>
          <Label htmlFor="contactEmail" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
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
          {errors.contactEmail ? <p className="mt-1 text-xs text-red-300">{errors.contactEmail}</p> : null}
        </div>

        <div>
          <Label htmlFor="notes" className="mb-2 block text-xs font-medium uppercase text-muted-foreground">
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

      {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" className="h-8 rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/90" size="sm" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Client"}
        </Button>
        <Button type="button" variant="outline" className="h-8 rounded-md px-3" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
