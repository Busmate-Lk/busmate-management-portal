"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { NotificationDetail } from "@/components/admin/notifications"

export default function SentNotificationDetailPage() {
  const params = useParams()
  const notificationId = params.id as string

  return (
    <Layout
      activeItem="notifications"
      pageTitle="Notification Details"
      pageDescription="View sent notification details and delivery analytics"
      role="admin"
      breadcrumbs={[
        { label: "Notifications", href: "/admin/notifications" },
        { label: "Sent", href: "/admin/notifications/sent" },
        { label: "Details" },
      ]}
    >
      <NotificationDetail notificationId={notificationId} />
    </Layout>
  )
}
