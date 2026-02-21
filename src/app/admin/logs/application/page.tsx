"use client"

import { Layout } from "@/components/shared/layout"
import { ApplicationLogs } from "@/components/admin/logs"

export default function ApplicationLogsPage() {
  return (
    <Layout
      activeItem="logs"
      pageTitle="Application Logs"
      pageDescription="View application errors, warnings, and system messages"
      role="admin"
    >
      <ApplicationLogs />
    </Layout>
  )
}
