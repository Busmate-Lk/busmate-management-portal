"use client"

import { Layout } from "@/components/shared/layout"
import { UserActivityLogs } from "@/components/admin/logs"

export default function UserActivityLogsPage() {
  return (
    <Layout
      activeItem="logs"
      pageTitle="User Activity Logs"
      pageDescription="Track and monitor all user actions across the platform"
      role="admin"
    >
      <UserActivityLogs />
    </Layout>
  )
}
