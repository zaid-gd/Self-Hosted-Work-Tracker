import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
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

  return (
    <div className="page-wrap">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl text-foreground">{client.name}</h1>
        <Link
          href={`/clients/${id}/edit`}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium text-foreground"
        >
          Edit
        </Link>
      </div>

      <section className="space-y-2 text-sm text-muted-foreground">
        <div>{client.contactEmail || "-"}</div>
        {client.notes ? <div className="whitespace-pre-wrap text-foreground">{client.notes}</div> : null}
      </section>

      <div className="text-sm text-muted-foreground">
        {client.projects.length} project{client.projects.length !== 1 ? "s" : ""} ·{" "}
        <span className="tabular-nums text-foreground">{formatCurrency(totalValue, "INR")}</span> total ·{" "}
        <span className="tabular-nums text-red-400">{formatCurrency(unpaidValue, "INR")}</span> unpaid
      </div>

      <section className="surface-panel overflow-hidden rounded-lg">
        <table className="data-table">
          <thead className="bg-zinc-900/80">
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
              <tr key={project.id} className="hover:bg-zinc-900/55">
                <td>
                  <Link href={`/projects/${project.id}`} className="font-medium text-foreground hover:text-primary">
                    {project.title}
                  </Link>
                </td>
                <td className="text-muted-foreground">{project.status}</td>
                <td className="text-muted-foreground">{project.paymentType}</td>
                <td className="text-right font-medium tabular-nums text-foreground">
                  {formatCurrency(project.agreedAmount, project.currency)}
                </td>
                <td className={project.isPaid ? "text-emerald-400" : "text-red-400"}>
                  {project.isPaid ? "Paid" : "Open"}
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
