"use client"

import { Layout } from "@/components/shared/layout"
import { ComposeMessage } from "@/components/admin/broadcast"

export default function ComposeNotificationPage() {
  return (
    <Layout
      activeItem="notifications"
      pageTitle="Compose Notification"
      pageDescription="Create and send notifications to users"
      role="admin"
      breadcrumbs={[
        { label: "Notifications", href: "/admin/notifications" },
        { label: "Compose" },
      ]}
    >
      <ComposeMessage />
    </Layout>
  )
}
