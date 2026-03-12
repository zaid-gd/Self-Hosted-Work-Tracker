"use client"

import { Button } from "@/components/ui/button"
import type { ProjectAttachment } from "@/types"
import { Download, Loader2, Trash2, Upload } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  projectId: string
}

function formatBytes(value: number | null) {
  if (!value) return "-"
  const units = ["B", "KB", "MB", "GB"]
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export function ProjectFiles({ projectId }: Props) {
  const [files, setFiles] = useState<ProjectAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function fetchFiles() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/projects/${projectId}/files`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load files")
      }

      setFiles(payload)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [projectId])

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
    if (!selectedFiles?.length) return

    setUploading(true)
    setError("")

    try {
      for (const file of Array.from(selectedFiles)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`/api/projects/${projectId}/files`, {
          method: "POST",
          body: formData,
        })
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error ?? `Failed to upload ${file.name}`)
        }

        setFiles((current) => [payload, ...current])
      }

      event.target.value = ""
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(fileId: string) {
    setError("")

    try {
      const response = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
        method: "DELETE",
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to delete file")
      }

      setFiles((current) => current.filter((file) => file.id !== fileId))
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Delete failed")
    }
  }

  return (
    <section className="surface-panel p-5">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Project Archive</p>
          <h2 className="mt-1 text-2xl text-stone-900">Cloud files for this delivery.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Keep exports, source files, drafts, and final handoff material attached to the project so the record stays complete.
          </p>
        </div>
        <label className="inline-flex">
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleUpload}
            disabled={uploading}
          />
          <span>
            <Button type="button" disabled={uploading}>
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload files
            </Button>
          </span>
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-8 text-sm text-stone-500">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="py-8 text-sm leading-6 text-stone-500">
          No files uploaded yet. Add deliverables or working files to keep this project complete in the cloud.
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-stone-900">{file.fileName}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {formatBytes(file.sizeBytes)}
                  {file.mimeType ? ` · ${file.mimeType}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {file.signedUrl ? (
                  <a href={file.signedUrl} target="_blank" rel="noreferrer">
                    <Button type="button" variant="outline" className="border-stone-200">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
