import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import { ProjectSchema } from "@/lib/validators"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        client: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const body = await req.json()
    const data = ProjectSchema.partial().parse(body)

    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: data.clientId, userId },
        select: { id: true },
      })

      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
      }
    }

    const result = await prisma.project.updateMany({
      where: { id, userId },
      data: {
        ...data,
        agreedAmount: data.agreedAmount !== undefined ? (data.agreedAmount ?? null) : undefined,
        dueDate: data.dueDate !== undefined ? (data.dueDate ?? null) : undefined,
        completedAt: data.completedAt !== undefined ? (data.completedAt ?? null) : undefined,
      },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        client: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(project)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
    }
    console.error("PUT /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const result = await prisma.project.deleteMany({ where: { id, userId } })
    if (result.count === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
