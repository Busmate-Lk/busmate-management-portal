"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { NotificationDetail } from "@/components/admin/notifications"

export default function NotificationDetailPage() {
  const params = useParams()
  const notificationId = params.id as string

  return (
    <Layout
      activeItem="notifications"
      pageTitle="Notification Details"
      pageDescription="View notification content and details"
      role="admin"
      breadcrumbs={[
        { label: "Notifications", href: "/admin/notifications" },
        { label: "Details" },
      ]}
    >
      <NotificationDetail notificationId={notificationId} />
    </Layout>
  )
}
