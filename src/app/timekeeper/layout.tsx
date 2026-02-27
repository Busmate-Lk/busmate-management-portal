import type React from 'react'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { TimekeeperLayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'BUSMATE LK Timekeeper Portal',
  description: 'Timekeeper portal for BUSMATE LK transportation system',
}

export default function TimekeeperRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TimekeeperLayoutClient>
        {children}
      </TimekeeperLayoutClient>
      <Toaster />
    </>
  )
}
