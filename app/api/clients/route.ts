import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ClientSchema } from "@/lib/validators"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: { select: { projects: true } },
        projects: {
          select: { agreedAmount: true },
        },
      },
      orderBy: { name: "asc" },
    })

    const clientsWithStats = clients.map((c) => ({
      ...c,
      projectCount: c._count.projects,
      totalAgreedAmount: c.projects.reduce((sum, p) => sum + (p.agreedAmount ?? 0), 0),
    }))

    return NextResponse.json(clientsWithStats)
  } catch (error) {
    console.error("GET /api/clients error:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ClientSchema.parse(body)

    const client = await prisma.client.create({ data })
    return NextResponse.json(client, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
    }
    console.error("POST /api/clients error:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
