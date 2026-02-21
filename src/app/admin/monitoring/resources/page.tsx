"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { ResourceUsagePanel } from "@/components/admin/monitoring"
import { useSystemMonitoring } from "@/hooks/useSystemMonitoring"

export default function ResourceUsagePage() {
  useSetPageMetadata({
    title: "Resource Usage",
    description: "Monitor server resource utilization and trends",
    activeItem: "monitoring",
  })

  const monitoring = useSystemMonitoring({
    enablePerformance: false,
    enableApiMonitoring: false,
    enableAlerts: false,
  })

  return (
    <ResourceUsagePanel
      history={monitoring.resourceHistory}
      latest={monitoring.latestResource}
      loading={monitoring.loading}
      isLive={monitoring.isLive}
      lastRefresh={monitoring.lastRefresh}
      onToggleLive={monitoring.toggleLive}
      onRefresh={monitoring.refresh}
    />
  )
}
