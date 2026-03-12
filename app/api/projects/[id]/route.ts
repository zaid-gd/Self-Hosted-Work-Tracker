import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ProjectSchema } from "@/lib/validators"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
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
    const { id } = await params
    const body = await req.json()
    const data = ProjectSchema.partial().parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        agreedAmount: data.agreedAmount !== undefined ? (data.agreedAmount ?? null) : undefined,
        dueDate: data.dueDate !== undefined ? (data.dueDate ?? null) : undefined,
        completedAt: data.completedAt !== undefined ? (data.completedAt ?? null) : undefined,
      },
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
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
