import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { hasClerkEnv } from "@/lib/clerk-config"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
])
const isApiRoute = createRouteMatcher(["/api/(.*)"])

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) {
    return
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export default async function proxy(req: NextRequest, evt: unknown) {
  if (!hasClerkEnv()) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  return clerkHandler(req, evt as never)
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/"],
}
