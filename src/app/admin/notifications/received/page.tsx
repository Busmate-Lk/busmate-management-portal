"use client"

import { Layout } from "@/components/shared/layout"
import { MessageHistory } from "@/components/admin/broadcast"

export default function ReceivedNotificationsPage() {
  return (
    <Layout
      activeItem="notifications"
      pageTitle="Received Notifications"
      pageDescription="View notifications received from system and other administrators"
      role="admin"
    >
      <MessageHistory />
    </Layout>
  )
}
