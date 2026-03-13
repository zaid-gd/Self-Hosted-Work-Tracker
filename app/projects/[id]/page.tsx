import { PaymentTypeBadge } from "@/components/projects/PaymentTypeBadge"
import { ProjectFiles } from "@/components/projects/ProjectFiles"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { Button } from "@/components/ui/button"
import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getOptionalUserId()
  const project = await prisma.project.findFirst({
    where: { id, userId: userId ?? "" },
    include: { client: true },
  })

  if (!project) return notFound()

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-foreground">{project.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.client.name}</p>
        </div>
        <Link href={`/projects/${id}/edit`}>
          <Button className="h-8 rounded-md px-3" variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <ProjectStatusBadge status={project.status} />
        <PaymentTypeBadge paymentType={project.paymentType} />
        <span
          className={
            project.isPaid
              ? "inline-flex h-6 items-center rounded-md bg-emerald-950 px-2.5 text-[11px] font-medium text-emerald-300"
              : "inline-flex h-6 items-center rounded-md bg-red-950 px-2.5 text-[11px] font-medium text-red-300"
          }
        >
          {project.isPaid ? "Paid" : "Outstanding"}
        </span>
      </div>

      <section className="surface-panel overflow-hidden rounded-lg">
        <table className="data-table">
          <tbody>
            <tr>
              <td className="w-48 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Client</td>
              <td>{project.client.name}</td>
            </tr>
            <tr>
              <td className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Agreed Amount</td>
              <td className="font-medium tabular-nums text-foreground">
                {formatCurrency(project.agreedAmount, project.currency)}
              </td>
            </tr>
            <tr>
              <td className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Due Date</td>
              <td>{formatDate(project.dueDate)}</td>
            </tr>
            <tr>
              <td className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Completed At</td>
              <td>{formatDate(project.completedAt)}</td>
            </tr>
            <tr>
              <td className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Tags</td>
              <td>{project.tags || "-"}</td>
            </tr>
            <tr>
              <td className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Notes</td>
              <td className="whitespace-pre-wrap">{project.notes || "-"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <ProjectFiles projectId={project.id} />
    </div>
  )
}
