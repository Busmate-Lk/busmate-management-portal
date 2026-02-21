"use client"

import { Layout } from "@/components/shared/layout"
import { SystemAnalytics } from "@/components/admin/analytics"

export default function AnalyticsPage() {
  return (
    <Layout
      activeItem="analytics"
      pageTitle="System Analytics"
      pageDescription="Analyze system performance, user behavior, and generate detailed reports"
      role="admin"
    >
      <SystemAnalytics />
    </Layout>
  )
}
