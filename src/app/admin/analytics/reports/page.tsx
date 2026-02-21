"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { AnalyticsReports } from "@/components/admin/analytics"

export default function ReportsPage() {
  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Analytics Reports",
    description: "View and generate system analytics reports",
    activeItem: "analytics",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Analytics", href: "/admin/analytics" },
      { label: "Reports" },
    ]
  })

  return <AnalyticsReports />
}
