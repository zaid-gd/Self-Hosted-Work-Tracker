import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"

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
  const { userId } = await auth()
  const isSignedIn = Boolean(userId)

  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-zinc-50`}>
        <ClerkProvider>
          {isSignedIn ? (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          ) : (
            <main>{children}</main>
          )}
        </ClerkProvider>
      </body>
    </html>
  )
}
