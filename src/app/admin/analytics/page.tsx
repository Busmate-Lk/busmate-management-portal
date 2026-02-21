"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { SystemAnalytics } from "@/components/admin/analytics"

export default function AnalyticsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "System Analytics",
    description: "Analyze system performance, user behavior, and generate detailed reports",
    activeItem: "analytics"
  })

  return <SystemAnalytics />
}
