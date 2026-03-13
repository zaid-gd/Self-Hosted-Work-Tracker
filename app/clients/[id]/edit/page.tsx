import { ClientForm } from "@/components/clients/ClientForm"
import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Client } from "@/types"
import { notFound } from "next/navigation"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getOptionalUserId()
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
    <div className="page-wrap">
      <div>
        <h1 className="text-xl text-foreground">Edit Client</h1>
      </div>
      <ClientForm client={client} />
    </div>
  )
}
