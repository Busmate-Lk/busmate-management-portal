"use client"

import { Layout } from "@/components/shared/layout"
import { MessageHistory } from "@/components/admin/broadcast"

export default function SentNotificationsPage() {
  return (
    <Layout
      activeItem="notifications"
      pageTitle="Sent Notifications"
      pageDescription="View all sent notifications and their delivery status"
      role="admin"
    >
      <MessageHistory />
    </Layout>
  )
}
