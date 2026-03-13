import { ProjectForm } from "@/components/projects/ProjectForm"
import { getOptionalUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPrismaErrorMessage } from "@/lib/prisma-errors"
import type { Client } from "@/types"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const userId = await getOptionalUserId()

  if (!userId) {
    return null
  }

  try {
    const clientsRaw = await prisma.client.findMany({
      where: { userId },
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
    })

    const clients: Client[] = clientsRaw.map((client) => ({
      ...client,
      contactEmail: client.contactEmail ?? null,
      notes: client.notes ?? null,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    }))

    return (
      <div className="page-wrap">
        <div>
          <h1 className="text-xl text-foreground">New Project</h1>
        </div>

        {clients.length === 0 ? (
          <section className="surface-panel rounded-lg px-3 py-3 text-sm text-muted-foreground">
            You need a client before creating a project.
            <Link href="/clients/new" className="ml-3 font-medium text-primary hover:text-amber-300">
              Create client
            </Link>
          </section>
        ) : (
          <ProjectForm clients={clients} />
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="page-wrap">
        <section className="surface-panel rounded-lg px-3 py-3 text-sm text-red-300">
          {getPrismaErrorMessage(error, "The project form could not load.")}
        </section>
      </div>
    )
  }
}
