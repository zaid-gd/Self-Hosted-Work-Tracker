import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist } from "next/font/google"
import { Sidebar } from "@/components/layout/Sidebar"
import { CLERK_MISSING_ENV_MESSAGE, hasClerkEnv } from "@/lib/clerk-config"
import { getOptionalUserId, isLocalAuthFallbackEnabled } from "@/lib/auth"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EditTracker",
  description: "Self-hosted work tracker for freelance video editors",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const clerkReady = hasClerkEnv()
  const localFallback = isLocalAuthFallbackEnabled()
  const isSignedIn = Boolean(await getOptionalUserId())

  if (!clerkReady && !localFallback) {
    return (
      <html lang="en" className="dark">
        <body className={`${geist.variable} bg-background text-foreground`}>
          <main className="page-wrap min-h-screen justify-center">
            <section className="surface-panel rounded-lg px-4 py-4 text-sm text-red-300">
              {CLERK_MISSING_ENV_MESSAGE}
            </section>
          </main>
        </body>
      </html>
    )
  }

  if (!clerkReady && localFallback) {
    return (
      <html lang="en" className="dark">
        <body className={`${geist.variable} bg-background text-foreground`}>
          {isSignedIn ? (
            <div className="min-h-screen bg-background lg:pl-52">
              <Sidebar showUserButton={false} />
              <main className="min-h-screen">{children}</main>
            </div>
          ) : (
            <main className="min-h-screen">{children}</main>
          )}
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} bg-background text-foreground`}>
        <ClerkProvider>
          {isSignedIn ? (
            <div className="min-h-screen bg-background lg:pl-52">
              <Sidebar />
              <main className="min-h-screen">{children}</main>
            </div>
          ) : (
            <main className="min-h-screen">{children}</main>
          )}
        </ClerkProvider>
      </body>
    </html>
  )
}
