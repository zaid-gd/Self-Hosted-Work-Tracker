import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { CLERK_MISSING_ENV_MESSAGE, hasClerkEnv } from "@/lib/clerk-config"
import { getOptionalUserId, isLocalAuthFallbackEnabled } from "@/lib/auth"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EditTracker Studio",
  description: "Professional freelance work tracking for editors and client operations.",
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
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}>
          <main className="page-wrap min-h-dvh justify-center">
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
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}>
          {isSignedIn ? (
            <div className="min-h-dvh bg-background lg:pl-48">
              <Sidebar />
              <div className="min-h-dvh">
                <TopBar />
                <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
              </div>
            </div>
          ) : (
            <main className="min-h-dvh">{children}</main>
          )}
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}>
        <ClerkProvider>
          {isSignedIn ? (
            <div className="min-h-dvh bg-background lg:pl-48">
              <Sidebar />
              <div className="min-h-dvh">
                <TopBar />
                <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
              </div>
            </div>
          ) : (
            <main className="min-h-dvh">{children}</main>
          )}
        </ClerkProvider>
      </body>
    </html>
  )
}
