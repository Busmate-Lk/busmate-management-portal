"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { SecurityLogs } from "@/components/admin/logs"

export default function SecurityLogsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Security Logs",
    description: "Monitor security events and suspicious activities",
    activeItem: "logs"
  })

  return <SecurityLogs />
}
