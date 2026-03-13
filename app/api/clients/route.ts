import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import { getPrismaErrorMessage, getPrismaErrorStatus } from "@/lib/prisma-errors"
import { ClientSchema } from "@/lib/validators"

export async function GET() {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const clients = await prisma.client.findMany({
      where: { userId },
      include: {
        _count: { select: { projects: true } },
        projects: {
          select: { agreedAmount: true, currency: true },
        },
      },
      orderBy: { name: "asc" },
    })

    const clientsWithStats = clients.map((c) => ({
      ...c,
      projectCount: c._count.projects,
      totalsByCurrency: c.projects.reduce<Record<string, number>>((totals, project) => {
        if (project.agreedAmount == null) return totals
        totals[project.currency] = (totals[project.currency] ?? 0) + project.agreedAmount
        return totals
      }, {}),
    }))

    return NextResponse.json(clientsWithStats)
  } catch (error) {
    console.error("GET /api/clients error:", error)
    return NextResponse.json(
      { error: getPrismaErrorMessage(error, "Failed to fetch clients") },
      { status: getPrismaErrorStatus(error) }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const body = await req.json()
    const data = ClientSchema.parse(body)

    const client = await prisma.client.create({
      data: { ...data, userId },
    })
    return NextResponse.json(client, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
    }
    console.error("POST /api/clients error:", error)
    return NextResponse.json(
      { error: getPrismaErrorMessage(error, "Failed to create client") },
      { status: getPrismaErrorStatus(error) }
    )
  }
}
