import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import { getStorageBucket, getSupabaseAdmin } from "@/lib/supabase"

export const runtime = "nodejs"

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id: projectId } = await params
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const attachments = await prisma.projectAttachment.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
    })

    const supabase = getSupabaseAdmin()
    const files = await Promise.all(
      attachments.map(async (attachment) => {
        const { data } = await supabase.storage
          .from(attachment.bucket)
          .createSignedUrl(attachment.storagePath, 60 * 60)

        return {
          ...attachment,
          signedUrl: data?.signedUrl ?? null,
        }
      })
    )

    return NextResponse.json(files)
  } catch (error) {
    console.error("GET /api/projects/[id]/files error:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()

    const { id: projectId } = await params
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const safeName = sanitizeFileName(file.name)
    const bucket = getStorageBucket()
    const storagePath = `${userId}/${projectId}/${Date.now()}-${safeName}`
    const arrayBuffer = await file.arrayBuffer()
    const supabase = getSupabaseAdmin()

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const attachment = await prisma.projectAttachment.create({
      data: {
        userId,
        projectId,
        fileName: file.name,
        storagePath,
        bucket,
        mimeType: file.type || null,
        sizeBytes: file.size,
      },
    })

    const { data: signedData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 60 * 60)

    return NextResponse.json(
      {
        ...attachment,
        signedUrl: signedData?.signedUrl ?? null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/projects/[id]/files error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
