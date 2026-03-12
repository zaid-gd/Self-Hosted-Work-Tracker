import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function requireUserId() {
  const { userId } = await auth()
  return userId
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
