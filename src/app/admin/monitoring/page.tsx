"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { MonitoringOverview } from "@/components/admin/monitoring"
import { useSystemMonitoring } from "@/hooks/useSystemMonitoring"

export default function MonitoringPage() {
  useSetPageMetadata({
    title: "System Monitoring",
    description: "Overview of system health, performance, and alerts",
    activeItem: "monitoring",
  })

  const monitoring = useSystemMonitoring()

  return (
    <MonitoringOverview
      healthSummary={monitoring.healthSummary}
      latestPerformance={monitoring.latestPerformance}
      performanceHistory={monitoring.performanceHistory}
      apiEndpoints={monitoring.apiEndpoints}
      microservices={monitoring.microservices}
      activeAlerts={monitoring.activeAlerts}
      loading={monitoring.loading}
      isLive={monitoring.isLive}
      lastRefresh={monitoring.lastRefresh}
      onToggleLive={monitoring.toggleLive}
      onRefresh={monitoring.refresh}
    />
  )
}
