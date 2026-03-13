import { PaymentTypeBadge } from "@/components/projects/PaymentTypeBadge"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatCurrencyTotals } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getOptionalUserId()

  const client = await prisma.client.findFirst({
    where: { id, userId: userId ?? "" },
    include: {
      projects: {
        include: { client: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!client) return notFound()

  const totalValue = client.projects.reduce((sum, project) => sum + (project.agreedAmount ?? 0), 0)
  const unpaidValue = client.projects
    .filter((project) => !project.isPaid && project.agreedAmount != null)
    .reduce((sum, project) => sum + (project.agreedAmount ?? 0), 0)
  const totalsByCurrency = client.projects.reduce<Record<string, number>>((accumulator, project) => {
    if (project.agreedAmount == null) return accumulator
    accumulator[project.currency] = (accumulator[project.currency] ?? 0) + project.agreedAmount
    return accumulator
  }, {})
  const unpaidByCurrency = client.projects.reduce<Record<string, number>>((accumulator, project) => {
    if (project.isPaid || project.agreedAmount == null) return accumulator
    accumulator[project.currency] = (accumulator[project.currency] ?? 0) + project.agreedAmount
    return accumulator
  }, {})

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="text-base font-medium text-foreground">{client.name}</h1>
        <Link
          href={`/clients/${id}/edit`}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium text-foreground"
        >
          Edit
        </Link>
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        <div>{client.contactEmail || "-"}</div>
        {client.notes ? <div className="whitespace-pre-wrap text-foreground">{client.notes}</div> : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="tabular-nums">{client.projects.length} projects</span>
        <span className="tabular-nums text-foreground">
          {Object.keys(totalsByCurrency).length === 1
            ? formatCurrency(totalValue, Object.keys(totalsByCurrency)[0])
            : formatCurrencyTotals(totalsByCurrency)}
        </span>
        <span className="tabular-nums text-red-300">
          {Object.keys(unpaidByCurrency).length === 1
            ? formatCurrency(unpaidValue, Object.keys(unpaidByCurrency)[0])
            : formatCurrencyTotals(unpaidByCurrency)}
        </span>
      </div>

      <section className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="text-right">Amount</th>
              <th>Paid</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {client.projects.map((project) => (
              <tr key={project.id} className="hover:bg-background/80">
                <td>
                  <Link href={`/projects/${project.id}`} className="table-row-link">
                    {project.title}
                  </Link>
                </td>
                <td>
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td>
                  <PaymentTypeBadge paymentType={project.paymentType} />
                </td>
                <td className="text-right font-medium tabular-nums text-foreground">
                  {formatCurrency(project.agreedAmount, project.currency)}
                </td>
                <td className={project.isPaid ? "text-emerald-300" : "text-red-300"}>
                  {project.isPaid ? "Paid" : "Outstanding"}
                </td>
                <td className="tabular-nums text-muted-foreground">
                  {project.dueDate
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(project.dueDate))
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
