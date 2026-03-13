import { ProjectForm } from "@/components/projects/ProjectForm"
import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Client, Project } from "@/types"
import { notFound } from "next/navigation"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userId = await getOptionalUserId()

  const [projectRaw, clientsRaw] = await Promise.all([
    prisma.project.findFirst({
      where: { id, userId: userId ?? "" },
      include: { client: true },
    }),
    prisma.client.findMany({
      where: { userId: userId ?? "" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        userId: true,
        name: true,
        contactEmail: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
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

  const clients: Client[] = clientsRaw.map((client) => ({
    ...client,
    contactEmail: client.contactEmail ?? null,
    notes: client.notes ?? null,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }))

  return (
    <div className="page-wrap">
      <h1 className="text-base font-medium text-foreground">Edit Project</h1>
      <ProjectForm clients={clients} project={project} />
    </div>
  )
}
