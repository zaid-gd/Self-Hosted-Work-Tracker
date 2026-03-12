import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ClientSchema } from "@/lib/validators"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await prisma.client.findUnique({
      where: { id },
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
    const { id } = await params
    const body = await req.json()
    const data = ClientSchema.partial().parse(body)

    const client = await prisma.client.update({
      where: { id },
      data,
    })

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
    const { id } = await params
    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
