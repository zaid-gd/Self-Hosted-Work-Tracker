"use client"

import { Button } from "@/components/ui/button"
import { getApiErrorMessage, readApiPayload } from "@/lib/api-response"
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
      const payload = await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to load files"))
      }

      setFiles(Array.isArray(payload) ? payload : [])
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
        const payload = await readApiPayload(response)

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(response, payload, `Failed to upload ${file.name}`)
          )
        }

        if (payload && typeof payload === "object") {
          setFiles((current) => [payload as ProjectAttachment, ...current])
        }
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
      const payload = await readApiPayload(response)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response, payload, "Failed to delete file"))
      }

      setFiles((current) => current.filter((file) => file.id !== fileId))
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Delete failed")
    }
  }

  return (
    <section className="surface-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="text-sm font-medium text-foreground">Files</h2>
        <label className="inline-flex">
          <input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
          <span>
            <Button type="button" className="h-7 rounded-md px-2.5" size="sm" disabled={uploading}>
              {uploading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-1 h-3.5 w-3.5" />}
              Upload
            </Button>
          </span>
        </label>
      </div>

      {error ? <div className="px-3 py-2 text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="px-3 py-3 text-sm text-muted-foreground">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="px-3 py-3 text-sm text-muted-foreground">No files uploaded.</div>
      ) : (
        <table className="data-table">
          <thead className="bg-zinc-900/80">
            <tr>
              <th>File</th>
              <th>Type</th>
              <th className="text-right">Size</th>
              <th className="w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="group hover:bg-zinc-900/55">
                <td className="font-medium text-foreground">{file.fileName}</td>
                <td className="text-muted-foreground">{file.mimeType || "-"}</td>
                <td className="text-right tabular-nums text-muted-foreground">{formatBytes(file.sizeBytes)}</td>
                <td>
                  <div className="flex justify-end gap-1">
                    {file.signedUrl ? (
                      <a href={file.signedUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-zinc-800 hover:text-foreground">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-400 hover:bg-red-950 hover:text-red-300"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
