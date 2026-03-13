import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUserId, unauthorizedResponse } from "@/lib/auth"
import {
  getSupabaseAdmin,
  hasSupabaseStorageEnv,
  SUPABASE_STORAGE_MISSING_ENV_MESSAGE,
} from "@/lib/supabase"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const userId = await requireUserId()
    if (!userId) return unauthorizedResponse()
    if (!hasSupabaseStorageEnv()) {
      return NextResponse.json({ error: SUPABASE_STORAGE_MISSING_ENV_MESSAGE }, { status: 503 })
    }

    const { id: projectId, fileId } = await params

    const attachment = await prisma.projectAttachment.findFirst({
      where: { id: fileId, projectId, userId },
    })

    if (!attachment) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const supabase = getSupabaseAdmin()
    const { error: deleteError } = await supabase.storage
      .from(attachment.bucket)
      .remove([attachment.storagePath])

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    await prisma.projectAttachment.delete({
      where: { id: attachment.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/projects/[id]/files/[fileId] error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes("is not configured")
            ? SUPABASE_STORAGE_MISSING_ENV_MESSAGE
            : "Failed to delete file",
      },
      { status: error instanceof Error && error.message.includes("is not configured") ? 503 : 500 }
    )
  }
}
