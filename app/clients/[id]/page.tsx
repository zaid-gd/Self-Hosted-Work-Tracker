import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      _count: { select: { projects: true } },
    },
  })

  if (!client) return notFound()

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{client.name}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {client._count.projects} project{client._count.projects !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href={`/clients/${id}/edit`}>
          <Button size="sm" variant="outline">
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-lg divide-y">
        {[
          ["Email", client.contactEmail ?? "—"],
          ["Added", formatDate(client.createdAt)],
          ["Last Updated", formatDate(client.updatedAt)],
        ].map(([label, value]) => (
          <div key={label as string} className="px-4 py-3 flex gap-4">
            <span className="text-xs text-zinc-500 w-28 shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-zinc-800">{value}</span>
          </div>
        ))}

        {client.notes && (
          <div className="px-4 py-3 flex gap-4">
            <span className="text-xs text-zinc-500 w-28 shrink-0 pt-0.5">Notes</span>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/clients" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← Back to Clients
        </Link>
        <Link
          href={`/projects?clientId=${id}`}
          className="text-sm text-zinc-500 hover:text-zinc-800 underline"
        >
          View all projects →
        </Link>
      </div>
    </div>
  )
}
