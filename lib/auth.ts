import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { CLERK_MISSING_ENV_MESSAGE, hasClerkEnv } from "@/lib/clerk-config"

export function isLocalAuthFallbackEnabled() {
  return !hasClerkEnv() && process.env.NODE_ENV !== "production"
}

export function getLocalAuthFallbackUserId() {
  if (!isLocalAuthFallbackEnabled()) {
    return null
  }

  return process.env.SEED_USER_ID || "demo_user"
}

export async function getOptionalUserId() {
  const fallbackUserId = getLocalAuthFallbackUserId()
  if (fallbackUserId) {
    return fallbackUserId
  }

  if (!hasClerkEnv()) {
    return null
  }

  try {
    const { userId } = await auth()
    return userId ?? null
  } catch (error) {
    console.error("Clerk auth error:", error)
    return null
  }
}

export async function requireUserId() {
  return getOptionalUserId()
}

export function unauthorizedResponse() {
  if (isLocalAuthFallbackEnabled()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!hasClerkEnv()) {
    return NextResponse.json({ error: CLERK_MISSING_ENV_MESSAGE }, { status: 503 })
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
