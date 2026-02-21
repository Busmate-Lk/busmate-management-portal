"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { ApiHealth } from "@/components/admin/monitoring"

export default function ApiHealthPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "API Health",
    description: "Monitor API endpoints status and performance",
    activeItem: "monitoring"
  })

  return <ApiHealth />
}
