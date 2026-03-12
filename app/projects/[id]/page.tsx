import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { PaymentTypeBadge } from "@/components/projects/PaymentTypeBadge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { client: true },
  })

  if (!project) return notFound()

  const tags = project.tags
    ? project.tags.split(",").filter(Boolean).map((t) => t.trim())
    : []

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{project.title}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{project.client.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${id}/edit`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <ProjectStatusBadge status={project.status} />
        <PaymentTypeBadge paymentType={project.paymentType} />
        {project.isPaid ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> Not Paid
          </span>
        )}
      </div>

      {/* Details Grid */}
      <div className="bg-white border rounded-lg divide-y">
        {[
          ["Client", project.client.name],
          ["Agreed Amount", formatCurrency(project.agreedAmount, project.currency)],
          ["Due Date", formatDate(project.dueDate)],
          ["Completed At", formatDate(project.completedAt)],
          ["Added On", formatDate(project.createdAt)],
        ].map(([label, value]) => (
          <div key={label as string} className="px-4 py-3 flex gap-4">
            <span className="text-xs text-zinc-500 w-28 shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-zinc-800">{value}</span>
          </div>
        ))}

        {tags.length > 0 && (
          <div className="px-4 py-3 flex gap-4">
            <span className="text-xs text-zinc-500 w-28 shrink-0 pt-0.5">Tags</span>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.notes && (
          <div className="px-4 py-3 flex gap-4">
            <span className="text-xs text-zinc-500 w-28 shrink-0 pt-0.5">Notes</span>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">{project.notes}</p>
          </div>
        )}
      </div>

      <div>
        <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← Back to Projects
        </Link>
      </div>
    </div>
  )
}
