"use client"

import { Layout } from "@/components/shared/layout"
import { AnalyticsReports } from "@/components/admin/analytics"

export default function ReportsPage() {
  return (
    <Layout
      activeItem="analytics"
      pageTitle="Analytics Reports"
      pageDescription="View and generate system analytics reports"
      role="admin"
      breadcrumbs={[
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Reports" },
      ]}
    >
      <AnalyticsReports />
    </Layout>
  )
}
