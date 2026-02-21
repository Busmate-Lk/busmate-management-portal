"use client"

import { Layout } from "@/components/shared/layout"
import { MicroserviceUptime } from "@/components/admin/monitoring"

export default function MicroserviceUptimePage() {
  return (
    <Layout
      activeItem="monitoring"
      pageTitle="Microservice Uptime"
      pageDescription="Monitor microservice health and uptime statistics"
      role="admin"
    >
      <MicroserviceUptime />
    </Layout>
  )
}
