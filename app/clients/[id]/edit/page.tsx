import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { ClientForm } from "@/components/clients/ClientForm"
import type { Client } from "@/types"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  const clientRaw = await prisma.client.findFirst({ where: { id, userId: userId ?? "" } })

  if (!clientRaw) return notFound()

  const client: Client = {
    ...clientRaw,
    contactEmail: clientRaw.contactEmail ?? null,
    notes: clientRaw.notes ?? null,
    createdAt: clientRaw.createdAt.toISOString(),
    updatedAt: clientRaw.updatedAt.toISOString(),
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-zinc-900">Edit Client</h1>
        <p className="text-sm text-zinc-500">{client.name}</p>
      </div>
      <ClientForm client={client} />
    </div>
  )
}
