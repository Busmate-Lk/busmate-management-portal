"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { ResourceUsage } from "@/components/admin/monitoring"

export default function ResourceUsagePage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Resource Usage",
    description: "Monitor server resource utilization and trends",
    activeItem: "monitoring"
  })

  return <ResourceUsage />
}
