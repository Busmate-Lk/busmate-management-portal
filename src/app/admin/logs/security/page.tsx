"use client"

import { Layout } from "@/components/shared/layout"
import { SecurityLogs } from "@/components/admin/logs"

export default function SecurityLogsPage() {
  return (
    <Layout
      activeItem="logs"
      pageTitle="Security Logs"
      pageDescription="Monitor security events and suspicious activities"
      role="admin"
    >
      <SecurityLogs />
    </Layout>
  )
}
