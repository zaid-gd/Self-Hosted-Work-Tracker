import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import { ProjectSchema } from "@/lib/validators"

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const paymentType = searchParams.get("paymentType")
    const clientId = searchParams.get("clientId")
    const isPaid = searchParams.get("isPaid")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "createdAt_desc"

    // Build where clause
    const where: Record<string, unknown> = { userId }

    if (status) where.status = status
    if (paymentType) where.paymentType = paymentType
    if (clientId) where.clientId = clientId
    if (isPaid !== null && isPaid !== "") where.isPaid = isPaid === "true"

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { notes: { contains: search } },
      ]
    }

    // Build orderBy
    let orderBy: Record<string, unknown> = { createdAt: "desc" }
    switch (sort) {
      case "createdAt_asc":
        orderBy = { createdAt: "asc" }
        break
      case "createdAt_desc":
        orderBy = { createdAt: "desc" }
        break
      case "dueDate_asc":
        orderBy = { dueDate: "asc" }
        break
      case "agreedAmount_desc":
        orderBy = { agreedAmount: "desc" }
        break
      case "clientName_asc":
        orderBy = { client: { name: "asc" } }
        break
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      include: {
        client: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const body = await req.json()
    const data = ProjectSchema.parse(body)

    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
      select: { id: true },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        userId,
        agreedAmount: data.agreedAmount ?? null,
        dueDate: data.dueDate ?? null,
        completedAt: data.completedAt ?? null,
        tags: data.tags ?? "",
        notes: data.notes ?? null,
      },
      include: {
        client: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
    }
    console.error("POST /api/projects error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
