import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { MotLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "BUSMATE LK MOT Portal",
  description: "Professional MOT dashboard for BUSMATE LK transportation system",
  generator: 'v0.dev'
}

export default function MotRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MotLayoutClient>
        {children}
      </MotLayoutClient>
      <Toaster />
    </>
  )
}
