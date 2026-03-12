import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/projects/ProjectForm"
import type { Client, Project } from "@/types"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [projectRaw, clientsRaw] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { client: true } }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, contactEmail: true, notes: true, createdAt: true, updatedAt: true },
    }),
  ])

  if (!projectRaw) return notFound()

  const project: Project = {
    ...projectRaw,
    client: { id: projectRaw.client.id, name: projectRaw.client.name },
    status: projectRaw.status as Project["status"],
    paymentType: projectRaw.paymentType as Project["paymentType"],
    createdAt: projectRaw.createdAt.toISOString(),
    updatedAt: projectRaw.updatedAt.toISOString(),
    dueDate: projectRaw.dueDate?.toISOString() ?? null,
    completedAt: projectRaw.completedAt?.toISOString() ?? null,
    notes: projectRaw.notes ?? null,
  }

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
        <h1 className="text-lg font-semibold text-zinc-900">Edit Project</h1>
        <p className="text-sm text-zinc-500">{project.title}</p>
      </div>
      <ProjectForm clients={clients} project={project} />
    </div>
  )
}
