"use client"

import { Layout } from "@/components/shared/layout"
import { ResourceUsage } from "@/components/admin/monitoring"

export default function ResourceUsagePage() {
  return (
    <Layout
      activeItem="monitoring"
      pageTitle="Resource Usage"
      pageDescription="Monitor server resource utilization and trends"
      role="admin"
    >
      <ResourceUsage />
    </Layout>
  )
}
