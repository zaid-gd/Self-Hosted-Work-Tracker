import { redirect } from "next/navigation"
import { getOptionalUserId, isLocalAuthFallbackEnabled } from "@/lib/auth"
import { CLERK_MISSING_ENV_MESSAGE, hasClerkEnv } from "@/lib/clerk-config"

export default async function Home() {
  if (!hasClerkEnv() && !isLocalAuthFallbackEnabled()) {
    return (
      <main className="page-wrap min-h-screen justify-center">
        <section className="surface-panel rounded-lg px-4 py-4 text-sm text-red-300">
          {CLERK_MISSING_ENV_MESSAGE}
        </section>
      </main>
    )
  }

  const userId = await getOptionalUserId()
  redirect(userId ? "/projects" : "/sign-in")
}
