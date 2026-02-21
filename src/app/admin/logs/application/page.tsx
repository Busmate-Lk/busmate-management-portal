"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { ApplicationLogs } from "@/components/admin/logs"

export default function ApplicationLogsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Application Logs",
    description: "View application errors, warnings, and system messages",
    activeItem: "logs"
  })

  return <ApplicationLogs />
}
