"use client"

import { Layout } from "@/components/shared/layout"
import { ApiHealth } from "@/components/admin/monitoring"

export default function ApiHealthPage() {
  return (
    <Layout
      activeItem="monitoring"
      pageTitle="API Health"
      pageDescription="Monitor API endpoints status and performance"
      role="admin"
    >
      <ApiHealth />
    </Layout>
  )
}
