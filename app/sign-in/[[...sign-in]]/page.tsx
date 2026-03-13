import { SignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { isLocalAuthFallbackEnabled } from "@/lib/auth"
import { CLERK_MISSING_ENV_MESSAGE, hasClerkEnv } from "@/lib/clerk-config"

export default function SignInPage() {
  if (isLocalAuthFallbackEnabled()) {
    redirect("/projects")
  }

  if (!hasClerkEnv()) {
    return (
      <main className="page-wrap min-h-screen justify-center">
        <section className="surface-panel rounded-lg px-4 py-4 text-sm text-red-300">
          {CLERK_MISSING_ENV_MESSAGE}
        </section>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <SignIn />
    </div>
  )
}
