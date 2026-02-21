import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { AdminLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "BUSMATE LK Admin Portal",
  description: "Professional admin dashboard for BUSMATE LK transportation system",
  generator: 'v0.dev'
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
      <Toaster />
    </>
  )
}
