import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { ProjectForm } from "@/components/projects/ProjectForm"
import type { Client } from "@/types"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const { userId } = await auth()

  const clientsRaw = await prisma.client.findMany({
    where: { userId: userId ?? "" },
    orderBy: { name: "asc" },
    select: { id: true, userId: true, name: true, contactEmail: true, notes: true, createdAt: true, updatedAt: true },
  })

  // Convert dates to strings
  const clients: Client[] = clientsRaw.map((c) => ({
    ...c,
    contactEmail: c.contactEmail ?? null,
    notes: c.notes ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-zinc-900">New Project</h1>
        <p className="text-sm text-zinc-500">Add a new video editing project</p>
      </div>
      <ProjectForm clients={clients} />
    </div>
  )
}
