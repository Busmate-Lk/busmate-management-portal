"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { UserActivityLogs } from "@/components/admin/logs"

export default function UserActivityLogsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "User Activity Logs",
    description: "Track and monitor all user actions across the platform",
    activeItem: "logs"
  })

  return <UserActivityLogs />
}
