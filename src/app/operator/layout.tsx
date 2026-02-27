import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { OperatorLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "BUSMATE LK Operator Portal",
  description: "Fleet operator dashboard for BUSMATE LK transportation system",
}

export default function OperatorRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <OperatorLayoutClient>
        {children}
      </OperatorLayoutClient>
      <Toaster />
    </>
  )
}