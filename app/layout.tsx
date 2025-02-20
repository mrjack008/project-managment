import '@/app/globals.css'
import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Project Hub</title>
        <meta name="description" content="Project and lead management system" />
      </head>
      <body className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}

