"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { NotificationDetail } from "@/components/admin/notifications"

export default function SentNotificationDetailPage() {
  const params = useParams()
  const notificationId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Notification Details",
    description: "View sent notification details and delivery analytics",
    activeItem: "notifications",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Notifications", href: "/admin/notifications" },
      { label: "Sent", href: "/admin/notifications/sent" },
      { label: "Details" },
    ]
  })

  return <NotificationDetail notificationId={notificationId} />
}
