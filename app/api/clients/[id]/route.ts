import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import { ClientSchema } from "@/lib/validators"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const client = await prisma.client.findFirst({
      where: { id, userId },
      include: {
        projects: {
          include: { client: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("GET /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const body = await req.json()
    const data = ClientSchema.partial().parse(body)

    const result = await prisma.client.updateMany({
      where: { id, userId },
      data,
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const client = await prisma.client.findFirst({ where: { id, userId } })
    return NextResponse.json(client)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
    }
    console.error("PUT /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id } = await params
    const result = await prisma.client.deleteMany({ where: { id, userId } })
    if (result.count === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
